const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../models/database');
const { authenticateToken, requireManager } = require('../middleware/auth');

const router = express.Router();

// Helper function to calculate business days
const calculateBusinessDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
};

// Get leave types
router.get('/types', authenticateToken, async (req, res) => {
  try {
    const types = await pool.all(
      'SELECT id, name, description, days_per_year FROM leave_types WHERE is_active = 1 ORDER BY name'
    );
    res.json(types);
  } catch (error) {
    console.error('Leave types error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Submit leave request
router.post('/request', [
  authenticateToken,
  body('leaveTypeId').isInt().withMessage('Valid leave type is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('reason').optional().isLength({ max: 500 }).withMessage('Reason must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { leaveTypeId, startDate, endDate, reason } = req.body;
    const userId = req.user.id;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({ error: 'Start date cannot be in the past' });
    }

    if (end < start) {
      return res.status(400).json({ error: 'End date cannot be before start date' });
    }

    const daysRequested = calculateBusinessDays(startDate, endDate);

    // Check leave balance
    const balanceRows = await pool.all(`
      SELECT remaining_days 
      FROM leave_balances 
      WHERE user_id = ? AND leave_type_id = ? AND year = strftime('%Y', 'now')
    `, [userId, leaveTypeId]);

    if (balanceRows.length === 0 || balanceRows[0].remaining_days < daysRequested) {
      return res.status(400).json({ error: 'Insufficient leave balance' });
    }

    // Get user's manager
    const userRows = await pool.all('SELECT manager_id FROM users WHERE id = ?', [userId]);
    const managerId = userRows[0]?.manager_id;

    // Insert leave request
    const result = await pool.run(`
      INSERT INTO leave_requests (user_id, leave_type_id, start_date, end_date, days_requested, reason, manager_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [userId, leaveTypeId, startDate, endDate, daysRequested, reason, managerId]);

    res.status(201).json({
      message: 'Leave request submitted successfully',
      requestId: result.insertId
    });
  } catch (error) {
    console.error('Submit leave request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's leave requests
router.get('/my-requests', authenticateToken, async (req, res) => {
  try {
    const requests = await pool.all(`
      SELECT 
        lr.id,
        lr.start_date,
        lr.end_date,
        lr.days_requested,
        lr.reason,
        lr.status,
        lr.manager_comments,
        lr.created_at,
        lt.name as leave_type,
        (u.first_name || ' ' || u.last_name) as employee_name
      FROM leave_requests lr
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      JOIN users u ON lr.user_id = u.id
      WHERE lr.user_id = ?
      ORDER BY lr.created_at DESC
    `, [req.user.id]);

    res.json(requests);
  } catch (error) {
    console.error('My requests error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all leave requests (for managers)
router.get('/all-requests', [authenticateToken, requireManager], async (req, res) => {
  try {
    const requests = await pool.all(`
      SELECT 
        lr.id,
        lr.start_date,
        lr.end_date,
        lr.days_requested,
        lr.reason,
        lr.status,
        lr.manager_comments,
        lr.created_at,
        lt.name as leave_type,
        (u.first_name || ' ' || u.last_name) as employee_name,
        u.employee_id
      FROM leave_requests lr
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      JOIN users u ON lr.user_id = u.id
      ORDER BY lr.created_at DESC
    `);

    res.json(requests);
  } catch (error) {
    console.error('All requests error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Approve/Reject leave request
router.put('/request/:id', [
  authenticateToken,
  requireManager,
  body('action').isIn(['approve', 'reject']).withMessage('Action must be approve or reject'),
  body('comments').optional().isLength({ max: 500 }).withMessage('Comments must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { action, comments } = req.body;
    const requestId = req.params.id;
    const status = action === 'approve' ? 'approved' : 'rejected';

    // Get the leave request details
    const requestRows = await pool.all(
      'SELECT * FROM leave_requests WHERE id = ?', 
      [requestId]
    );

    if (!requestRows || requestRows.length === 0) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    const request = requestRows[0];
    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Leave request has already been processed' });
    }

    // Update the leave request
    await pool.run(`
      UPDATE leave_requests 
      SET status = ?, manager_comments = ?, manager_id = ?, approved_at = ?
      WHERE id = ?
    `, [status, comments, req.user.id, status === 'approved' ? new Date() : null, requestId]);

    // If approved, update user's leave balance
    if (status === 'approved') {
      await pool.run(`
        UPDATE leave_balances 
        SET used_days = used_days + ?, remaining_days = remaining_days - ?
        WHERE user_id = ? AND leave_type_id = ? AND year = strftime('%Y', 'now')
      `, [request.days_requested, request.days_requested, request.user_id, request.leave_type_id]);
    }

    res.json({
      message: `Leave request ${status} successfully`,
      status: status
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get leave calendar data
router.get('/calendar', authenticateToken, async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = `
      SELECT 
        lr.id,
        lr.start_date,
        lr.end_date,
        lr.days_requested,
        lt.name as leave_type,
        (u.first_name || ' ' || u.last_name) as employee_name,
        u.employee_id
      FROM leave_requests lr
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      JOIN users u ON lr.user_id = u.id
      WHERE lr.status = 'approved'
    `;
    
    const params = [];
    
    if (month && year) {
      query += ` AND (
        (strftime('%Y', lr.start_date) = ? AND strftime('%m', lr.start_date) = ?) OR
        (strftime('%Y', lr.end_date) = ? AND strftime('%m', lr.end_date) = ?)
      )`;
      params.push(year, month, year, month);
    }
    
    query += ` ORDER BY lr.start_date ASC`;

    const requests = await pool.all(query, params);
    res.json(requests);
  } catch (error) {
    console.error('Calendar error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
