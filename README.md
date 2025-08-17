# 🏢 Employee Leave Management System (LMS 2.0)

A comprehensive web-based Employee Leave Management System built with Node.js, Express, and SQLite. This system supports 55+ employees across 6 departments with full leave tracking, approval workflows, and administrative features.

## Features

### **Multi-Role Authentication**
- **Admin Dashboard** - System administration and oversight
- **Manager Dashboard** - Team leave approvals and management
- **Employee Portal** - Leave requests and balance tracking

### 📊 **Leave Management**
- **6 Leave Types**: Annual, Sick, Personal, Emergency, Maternity, Paternity
- **Leave Balance Tracking** - Real-time balance calculations
- **Request Workflows** - Submit, approve, reject leave requests
- **Calendar Integration** - Visual leave calendar

### 👥 **Multi-Department Support**
- **6 Departments**: IT, HR, Sales, Marketing, Finance, Operations
- **55+ Employees** ready to use
- **Departmental Organization** with proper reporting structure

### 🛠️ **Technical Features**
- **SQLite Database** - Lightweight and efficient
- **JWT Authentication** - Secure token-based auth
- **RESTful API** - Clean API endpoints
- **Responsive Design** - Works on all devices
- **Password Hashing** - Secure bcrypt encryption

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

---



 More than 50 employees can successfully access the system!

### **Complete Login Credentials**

#### **Admin Account**
- **Email:** `admin@company.com`
- **Password:** `admin123`

#### **Manager Account**
- **Email:** `manager@company.com`
- **Password:** `manager123`

#### **All Employees**
**Password for ALL employees:** `employee123`

**Sample Employee Emails:**
- `lokesh@company.com` (IT Department)
- `mayank@company.com` (IT Department)
- `mohini@company.com` (HR Department)
- `aarav.sharma@company.com` (IT Department)
- `ananya.nair@company.com` (HR Department)
- `krishna.yadav@company.com` (Sales Department)
- `myra.kulkarni@company.com` (Marketing Department)
- `om.shukla@company.com` (Finance Department)
- `larisa.menon@company.com` (Operations Department)

### 📊 **System Statistics**
- **Total Users:** 55 (1 Admin + 1 Manager + 53 Employees)
- **Departments:** 6 departments with proper distribution
- **Leave Types:** 6 different leave categories
- **Leave Records:** 324 leave balance records initialized
- **Authentication:** 100% success rate for all users

###  **Department Distribution**

| Department | Employees | Sample Emails |
|------------|-----------|---------------|
| **IT** | 14 | `lokesh@company.com`, `aarav.sharma@company.com` |
| **HR** | 9 | `mohini@company.com`, `ananya.nair@company.com` |
| **Sales** | 8 | `krishna.yadav@company.com`, `aryan.mishra@company.com` |
| **Marketing** | 8 | `myra.kulkarni@company.com`, `aanya.joshi@company.com` |
| **Finance** | 8 | `om.shukla@company.com`, `aditi.goyal@company.com` |
| **Operations** | 6 | `larisa.menon@company.com`, `kiara.iyer@company.com` |

### 🧪 **Testing & Verification**

**Test Database Connectivity:**
```bash
node quick-login-test.js
```

**Test Web API Endpoints:**
```bash
node test-web-api.js
```

**Test All Employee Logins:**
```bash
node test-employee-logins.js
```

**View All Employee Emails:**
```bash
node list-employees.js
```

**Show Login Credentials:**
```bash
node show-credentials.js
```

**Reset All Passwords (if needed):**
```bash
node fix-all-employees.js
```

### **Quick Start Instructions**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LokeshYadav24/Employees-Leave-Management-System.git
   cd Employees-Leave-Management-System
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialize the system:**
   ```bash
   node fix-all-employees.js
   ```

4. **Start the server:**
   ```bash
   node server.js
   ```

5. **Access the application:**
   ```
   http://localhost:3001
   ```

6. **Login with any employee:**
   - Use any employee email + `employee123`
   - Manager: `manager@company.com` + `manager123`
   - Admin: `admin@company.com` + `admin123`

### 💡 **What Works**

 **Login:** All 55 employees can log in with their email + "employee123"  
 **Dashboard:** Each user sees their personalized dashboard  
 **Leave Requests:** Employees can submit leave requests  
 **Leave Balances:** All employees have proper leave allocations  
 **Manager Features:** Manager can approve/reject requests  
 **Admin Features:** Admin has full system access  
 **Multi-Department:** All 6 departments are fully functional  
 **Database:** 55 users, 324 leave balance records  
 **Authentication:** 100% login success rate  

### 🔧 **Troubleshooting Commands**

**If server won't start:**
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Kill process if needed (replace XXXX with actual PID)
taskkill /F /PID XXXX
```

**If login issues occur:**
```bash
# Verify all user credentials
node show-credentials.js

# Test specific login
node quick-login-test.js

# Reset all employee data
node fix-all-employees.js
```

**🌐 Live Demo:** Start the server and visit `http://localhost:3001`

**📧 For complete list of all 55 employee emails, run:** `node list-employees.js`
