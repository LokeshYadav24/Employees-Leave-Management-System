const express = require('express');
const pool = require('../models/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's leave balances
router.get('/leave-balances/:userId?', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    // Check permission
    if (userId != req.user.id && !['manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const balances = await pool.all(`
      SELECT 
        lb.id,
        lt.name as leave_type,
        lt.description,
        lb.allocated_days,
        lb.used_days,
        lb.remaining_days,
        lb.year
      FROM leave_balances lb
      JOIN leave_types lt ON lb.leave_type_id = lt.id
      WHERE lb.user_id = ? AND lb.year = strftime('%Y', 'now')
      ORDER BY lt.name
    `, [userId]);

    res.json(balances);
  } catch (error) {
    console.error('Leave balances error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get leave types
router.get('/leave-types', authenticateToken, async (req, res) => {
  try {
    const types = await pool.all(`
      SELECT id, name, description, days_per_year
      FROM leave_types 
      WHERE is_active = 1
      ORDER BY name
    `);

    res.json(types);
  } catch (error) {
    console.error('Leave types error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
