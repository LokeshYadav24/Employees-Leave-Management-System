# Employee Leave Management System

**Full-Stack Web Application for HR Leave Management**

A comprehensive employee leave management system built from scratch using Node.js, Express.js, and SQLite. This application demonstrates proficiency in full-stack development, database design, authentication, and modern web development practices.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation & Setup

1. **Clone or Download the Repository**
   ```bash
   git clone <repository-url>
   cd employee-leave-management
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Initialize Database**
   ```bash
   npm run setup
   npm run fix-passwords
   ```

4. **Start the Application**
   ```bash
   npm start
   ```

5. **Access the Application**
   - Open your browser and navigate to: `http://localhost:3001`

### Test Credentials

For testing purposes, the system comes pre-configured with these accounts:

| Role | Email | Password |
|------|-------|----------|
| Administrator | admin@company.com | admin123 |
| Manager | manager@company.com | manager123 |
| Employee | lokesh@company.com | employee123 |
| Employee | mayank@company.com | employee123 |
| Employee | mohini@company.com | employee123 |

---

## 📋 System Features

### 👤 For Employees
- 📊 **Dashboard**: Real-time leave balances and request status
- 📝 **Request Leave**: Smart date validation and conflict detection
- 📋 **My Requests**: Track all submitted requests with status updates
- 📅 **Leave Calendar**: Visual calendar showing team availability

### 👨‍💼 For Managers
- ✅ **Approve/Reject**: Quick review and processing of leave requests
- 👥 **Team Overview**: Complete visibility of team leave schedules
- 📈 **Analytics**: Leave usage statistics and patterns
- 🗓️ **Team Calendar**: Plan around team availability

### 🔧 For Administrators
- 👥 **User Management**: Add, edit, remove employees and managers
- ⚙️ **System Config**: Configure leave types, quotas, and policies
- 📊 **Reports**: Generate comprehensive leave reports
- 🔒 **Security**: Role-based access control

## 🛠️ Technology Stack

- **Backend**: Node.js 14+, Express.js
- **Database**: SQLite (zero configuration required!)
- **Authentication**: JWT with bcrypt password hashing
- **Frontend**: Modern Vanilla JavaScript, HTML5, CSS3
- **UI/UX**: Responsive design, mobile-friendly
- **Date Handling**: Flatpickr for enhanced date selection
- **Security**: CORS protection, input validation

## 🔐 Default Login Credentials

| Role | Email | Password | Name |
|------|-------|----------|------|
| **Admin** | admin@company.com | admin123 | System Admin |
| **Manager** | manager@company.com | manager123 | Rakesh Manager |
| **Employee** | lokesh@company.com | employee123 | Lokesh Yadav |
| **Employee** | mayank@company.com | employee123 | Mayank Yadav |
| **Employee** | mohini@company.com | employee123 | Mohini Yadav |

## 📁 Project Structure

```
employee-leave-management/
├── config/
│   ├── database.js          # Database configuration
│   ├── setup.sql           # MySQL setup (deprecated)
│   └── setup-sqlite.sql    # SQLite database schema
├── middleware/
│   └── auth.js             # Authentication middleware
├── models/
│   └── database.js         # Database connection and helpers
├── public/
│   ├── css/
│   │   └── style.css       # Application styling
│   ├── js/
│   │   └── app.js          # Frontend JavaScript
│   └── index.html          # Main HTML file
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── dashboard.js       # Dashboard data routes
│   ├── leaves.js          # Leave management routes
│   └── users.js           # User management routes
├── .env                   # Environment configuration
├── database.sqlite        # SQLite database file
├── package.json          # Node.js dependencies
├── server.js             # Main server file
└── setup.js              # Database initialization script
```

## 🔧 Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm run setup` - Initialize/reset the database
- `node debug.js` - Debug database contents
- `node update-manager.js` - Update manager information

## 🚀 Usage Guide

### Employee Workflow
1. **Login** with employee credentials
2. **View Dashboard** to see leave balances
3. **Request Leave** by selecting dates and leave type
4. **Track Requests** in "My Requests" section
5. **View Calendar** to see team availability

### Manager Workflow
1. **Login** with manager credentials
2. **Review Requests** in "All Requests" section
3. **Approve/Reject** with optional comments
4. **Monitor Team** via leave calendar
5. **View Statistics** on dashboard

## 📊 Leave Types

The system comes with pre-configured leave types:

| Leave Type | Days Per Year | Description |
|------------|---------------|-------------|
| Annual Leave | 25 | Yearly vacation days |
| Sick Leave | 10 | Medical leave for illness |
| Personal Leave | 5 | Personal time off |
| Emergency Leave | 3 | Emergency situations |
| Maternity Leave | 90 | Maternity leave for new mothers |
| Paternity Leave | 15 | Paternity leave for new fathers |

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access**: Different permissions for employees, managers, and admins
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-Origin Resource Sharing configuration

## 🛠️ Configuration

### Environment Variables (.env)
```
JWT_SECRET=your_jwt_secret_here
DB_PATH=database.sqlite
PORT=3000
NODE_ENV=development
```

### Database Configuration
- **SQLite Database**: `database.sqlite` (automatically created)
- **No external database required**
- **Automatic initialization** on first run

## 🔧 Customization

### Adding New Leave Types
1. Edit `config/setup-sqlite.sql`
2. Add new leave type in the INSERT statement
3. Run `npm run setup` to reinitialize

### Changing Styles
- Edit `public/css/style.css` for custom styling
- Responsive design already implemented

### Adding Features
- Backend routes: Add to `routes/` folder
- Frontend: Modify `public/js/app.js`
- Database: Update schema in `config/setup-sqlite.sql`

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Change PORT in `.env` file
   - Or kill process using port 3000

2. **Database Errors**
   - Delete `database.sqlite` and run `npm run setup`

3. **Login Issues**
   - Verify credentials in console output
   - Check if database was initialized properly

4. **Module Not Found**
   - Run `npm install` to install dependencies

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/employees` - Get all employees (managers only)

### Leaves
- `GET /api/leaves/types` - Get leave types
- `POST /api/leaves/request` - Submit leave request
- `GET /api/leaves/my-requests` - Get user's requests
- `GET /api/leaves/all-requests` - Get all requests (managers)
- `PUT /api/leaves/request/:id` - Approve/reject request
- `GET /api/leaves/calendar` - Get calendar data

### Users
- `GET /api/users/leave-balances/:userId?` - Get leave balances
- `GET /api/users/leave-types` - Get available leave types

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-activities` - Get recent activities

## 🚀 Deployment

### Local Deployment
- Already configured for local development
- Run `npm start` in project directory

### Production Deployment
1. Set `NODE_ENV=production` in `.env`
2. Use process manager like PM2
3. Configure reverse proxy (nginx/Apache)
4. Set up HTTPS certificate

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For support or questions:
1. Check the troubleshooting section
2. Review the console output for errors
3. Verify database initialization
4. Check network connectivity on localhost:3000

## 🔄 Updates

To update the system:
1. Backup your `database.sqlite` file
2. Update the code files
3. Run `npm install` for new dependencies
4. Restart the application

---

## 📋 Assessment Information

**Project Type**: Full-Stack Web Application Development Assessment
**Technologies Used**: Node.js, Express.js, SQLite, HTML5, CSS3, JavaScript
**Development Time**: Individual project developed from scratch
**Key Learning Outcomes**: 
- Full-stack application architecture
- Database design and management
- User authentication and authorization
- RESTful API development
- Responsive web design
- Security best practices

**Features Demonstrated**:
- Role-based access control
- CRUD operations
- Database relationships
- Input validation
- Error handling
- Session management
- Modern JavaScript (ES6+)
- Responsive CSS design

---

**Note**: This system demonstrates practical application of modern web development technologies and is suitable for small to medium-sized organizations.
