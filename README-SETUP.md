# Employee Leave Management System - Quick Setup Guide

A comprehensive web-based leave management system built with Node.js, Express, and SQLite.

## 🚀 Quick Start (Any Operating System)

### Prerequisites
- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Option 1: Automated Setup

#### On Windows:
1. Double-click `setup.bat`
2. Wait for completion
3. Run `npm start`
4. Open http://localhost:3001

#### On Linux/macOS:
1. Open terminal in project folder
2. Run `./setup.sh`
3. Run `npm start`
4. Open http://localhost:3001

### Option 2: Manual Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Database**
   ```bash
   npm run setup
   ```

3. **Fix Passwords (Important!)**
   ```bash
   npm run fix-passwords
   ```

4. **Start Application**
   ```bash
   npm start
   ```

5. **Open Browser**
   - Navigate to: `http://localhost:3001`

## 🔐 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@company.com | admin123 |
| **Manager** | manager@company.com | manager123 |
| **Employee** | lokesh@company.com | employee123 |
| **Employee** | mayank@company.com | employee123 |
| **Employee** | mohini@company.com | employee123 |

## 🛠️ Available Commands

- `npm start` - Start the application
- `npm run dev` - Start with auto-reload (development)
- `npm run setup` - Initialize/reset database
- `npm run fix-passwords` - Fix user passwords
- `npm run add-indian-employees` - Add 50 Indian employees to database
- `npm run list-employees` - Display all employees in the system
- `npm run full-setup` - Complete setup (install + database + passwords)
- `npm run reset-db` - Reset database and fix passwords

## 🔧 Configuration

The application uses these default settings (can be changed in `.env`):
- **Port**: 3001
- **Database**: SQLite (database.sqlite)
- **Environment**: Development

## 🌟 Features

### For Employees
- View leave balances and request status
- Submit leave requests with date validation
- Track submitted requests
- View leave calendar

### For Managers
- Approve/reject employee leave requests
- View team leave schedules
- Monitor team availability
- Leave management dashboard

### For Administrators
- Complete system access
- User management
- System configuration
- Full administrative privileges

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env file
PORT=3002
```

### Database Issues
```bash
# Reset database completely
npm run reset-db
```

### Login Problems
```bash
# Fix password hashes
npm run fix-passwords
```

### Module Not Found
```bash
# Reinstall dependencies
npm install
```

## 🚀 Cross-Platform Compatibility

This system has been tested and works on:
- ✅ Windows 10/11
- ✅ macOS (Intel & Apple Silicon)
- ✅ Linux (Ubuntu, CentOS, Debian)
- ✅ WSL (Windows Subsystem for Linux)

## 📁 Project Structure

```
employee-leave-management/
├── config/                 # Configuration files
├── middleware/             # Authentication middleware
├── models/                 # Database models
├── public/                 # Static files (HTML, CSS, JS)
├── routes/                 # API routes
├── .env                    # Environment variables
├── server.js              # Main server file
├── setup.js               # Database setup script
├── fix-passwords.js       # Password fix utility
├── setup.bat              # Windows setup script
├── setup.sh               # Linux/macOS setup script
└── package.json           # Dependencies and scripts
```

## 🔒 Security Features

- JWT token-based authentication
- bcrypt password hashing
- Role-based access control
- Input validation
- CORS protection
- SQLite database (no external database required)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues or questions:
1. Check this README
2. Verify Node.js installation
3. Ensure all dependencies are installed
4. Check that database was initialized properly
5. Verify application is running on correct port

---

**Made runnable on every system! 🌍**
