const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../models/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Login endpoint
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    const rows = await pool.all('SELECT * FROM users WHERE email = ? AND is_active = 1', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        employeeId: user.employee_id,
        name: `${user.first_name} ${user.last_name}`
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        employeeId: user.employee_id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const rows = await pool.all(
      'SELECT id, employee_id, email, first_name, last_name, role, department FROM users WHERE id = ?', 
      [req.user.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    res.json({
      id: user.id,
      employeeId: user.employee_id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      role: user.role,
      department: user.department
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all employees (for managers)
router.get('/employees', authenticateToken, async (req, res) => {
  try {
    if (!['manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Manager access required' });
    }

    const rows = await pool.all(
      'SELECT id, employee_id, email, first_name, last_name, role, department FROM users WHERE is_active = 1'
    );

    const employees = rows.map(user => ({
      id: user.id,
      employeeId: user.employee_id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      role: user.role,
      department: user.department
    }));

    res.json(employees);
  } catch (error) {
    console.error('Employees error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
