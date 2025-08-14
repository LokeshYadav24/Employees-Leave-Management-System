require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const leavesRoutes = require('./routes/leaves');
const usersRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leaves', leavesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/request-leave', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'request-leave.html'));
});

app.get('/manage-requests', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'manage-requests.html'));
});

app.get('/calendar', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'calendar.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Employee Leave Management System running on http://localhost:${PORT}`);
  console.log('Default login credentials:');
  console.log('Admin - Email: admin@company.com, Password: admin123');
  console.log('Manager (Rakesh) - Email: manager@company.com, Password: manager123');
  console.log('Employee - Email: lokesh@company.com, Password: employee123');
});
