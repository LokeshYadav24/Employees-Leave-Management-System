const express = require('express');
const pool = require('../models/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role === 'employee') {
      // Employee dashboard stats
      const pendingRequests = await pool.get(`
        SELECT COUNT(*) as count FROM leave_requests 
        WHERE user_id = ? AND status = 'pending'
      `, [req.user.id]);

      const totalRequests = await pool.get(`
        SELECT COUNT(*) as count FROM leave_requests 
        WHERE user_id = ?
      `, [req.user.id]);

      const leaveBalances = await pool.all(`
        SELECT 
          lt.name,
          lb.remaining_days
        FROM leave_balances lb
        JOIN leave_types lt ON lb.leave_type_id = lt.id
        WHERE lb.user_id = ? AND lb.year = strftime('%Y', 'now')
        ORDER BY lt.name
      `, [req.user.id]);

      res.json({
        pendingRequests: pendingRequests.count,
        totalRequests: totalRequests.count,
        leaveBalances: leaveBalances
      });

    } else {
      // Manager/Admin dashboard stats
      const pendingApprovals = await pool.get(`
        SELECT COUNT(*) as count FROM leave_requests 
        WHERE status = 'pending'
      `);

      const totalEmployees = await pool.get(`
        SELECT COUNT(*) as count FROM users 
        WHERE role = 'employee' AND is_active = 1
      `);

      const upcomingLeaves = await pool.get(`
        SELECT COUNT(*) as count FROM leave_requests 
        WHERE status = 'approved' AND start_date >= date('now') AND start_date <= date('now', '+7 days')
      `);

      res.json({
        pendingApprovals: pendingApprovals.count,
        totalEmployees: totalEmployees.count,
        upcomingLeaves: upcomingLeaves.count
      });
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get recent activities
router.get('/recent-activities', authenticateToken, async (req, res) => {
  try {
    let query, params;

    if (req.user.role === 'employee') {
      query = `
        SELECT 
          lr.id,
          lr.start_date,
          lr.end_date,
          lr.days_requested,
          lr.status,
          lr.created_at,
          lt.name as leave_type
        FROM leave_requests lr
        JOIN leave_types lt ON lr.leave_type_id = lt.id
        WHERE lr.user_id = ?
        ORDER BY lr.created_at DESC
        LIMIT 5
      `;
      params = [req.user.id];
    } else {
      query = `
        SELECT 
          lr.id,
          lr.start_date,
          lr.end_date,
          lr.days_requested,
          lr.status,
          lr.created_at,
          lt.name as leave_type,
          (u.first_name || ' ' || u.last_name) as employee_name
        FROM leave_requests lr
        JOIN leave_types lt ON lr.leave_type_id = lt.id
        JOIN users u ON lr.user_id = u.id
        ORDER BY lr.created_at DESC
        LIMIT 5
      `;
      params = [];
    }

    const activities = await pool.all(query, params);
    res.json(activities);
  } catch (error) {
    console.error('Recent activities error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
