-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT DEFAULT 'employee' CHECK(role IN ('employee', 'manager', 'admin')),
  department TEXT,
  manager_id INTEGER,
  hire_date DATE,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Leave types table
CREATE TABLE IF NOT EXISTS leave_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  days_per_year INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Leave balances table
CREATE TABLE IF NOT EXISTS leave_balances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  leave_type_id INTEGER NOT NULL,
  allocated_days DECIMAL(4,2) DEFAULT 0,
  used_days DECIMAL(4,2) DEFAULT 0,
  remaining_days DECIMAL(4,2) DEFAULT 0,
  year INTEGER DEFAULT (strftime('%Y', 'now')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE CASCADE,
  UNIQUE(user_id, leave_type_id, year)
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  leave_type_id INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested DECIMAL(4,2) NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  manager_id INTEGER,
  manager_comments TEXT,
  approved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default leave types
INSERT OR IGNORE INTO leave_types (id, name, days_per_year, description) VALUES
(1, 'Annual Leave', 25, 'Yearly vacation days'),
(2, 'Sick Leave', 10, 'Medical leave for illness'),
(3, 'Personal Leave', 5, 'Personal time off'),
(4, 'Emergency Leave', 3, 'Emergency situations'),
(5, 'Maternity Leave', 90, 'Maternity leave for new mothers'),
(6, 'Paternity Leave', 15, 'Paternity leave for new fathers');

-- Insert sample admin user
INSERT OR IGNORE INTO users (id, employee_id, email, password, first_name, last_name, role, department, hire_date) VALUES
(1, 'EMP001', 'admin@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'System', 'Admin', 'admin', 'IT', '2023-01-01');

-- Insert sample manager
INSERT OR IGNORE INTO users (id, employee_id, email, password, first_name, last_name, role, department, manager_id, hire_date) VALUES
(2, 'EMP002', 'manager@company.com', '$2b$10$u1CQQHTivY7UvQOlH0DGUOfZ8uJ.0m2HruD9Usk2Mb.r8wR.8ly6a', 'Rakesh', 'Manager', 'manager', 'HR', 1, '2023-01-15');

-- Insert employees
INSERT OR IGNORE INTO users (employee_id, email, password, first_name, last_name, role, department, manager_id, hire_date) VALUES
('EMP006', 'arjun@company.com', '$2b$10$Py3D04R4Pu2fEMOc3AjfHeCOIttvL1isTfrT1xK4c9aU5M3MzUp9a', 'Arjun', 'Sharma', 'employee', 'IT', 2, '2023-03-15'),
('EMP007', 'priya@company.com', '$2b$10$Py3D04R4Pu2fEMOc3AjfHeCOIttvL1isTfrT1xK4c9aU5M3MzUp9a', 'Priya', 'Verma', 'employee', 'HR', 2, '2023-03-20'),
('EMP008', 'rahul@company.com', '$2b$10$Py3D04R4Pu2fEMOc3AjfHeCOIttvL1isTfrT1xK4c9aU5M3MzUp9a', 'Rahul', 'Gupta', 'employee', 'Sales', 2, '2023-04-01'),
('EMP009', 'neha@company.com', '$2b$10$Py3D04R4Pu2fEMOc3AjfHeCOIttvL1isTfrT1xK4c9aU5M3MzUp9a', 'Neha', 'Patel', 'employee', 'Marketing', 2, '2023-04-10'),
('EMP010', 'vijay@company.com', '$2b$10$Py3D04R4Pu2fEMOc3AjfHeCOIttvL1isTfrT1xK4c9aU5M3MzUp9a', 'Vijay', 'Rao', 'employee', 'Finance', 2, '2023-04-15'),
('EMP011', 'anita@company.com', '$2b$10$Py3D04R4Pu2fEMOc3AjfHeCOIttvL1isTfrT1xK4c9aU5M3MzUp9a', 'Anita', 'Kumar', 'employee', 'Operations', 2, '2023-04-20'),
('EMP012', 'deepak@company.com', '$2b$10$Py3D04R4Pu2fEMOc3AjfHeCOIttvL1isTfrT1xK4c9aU5M3MzUp9a', 'Deepak', 'Mishra', 'employee', 'IT', 2, '2023-04-25'),
('EMP013', 'sonali@company.com', '$2b$10$Py3D04R4Pu2fEMOc3AjfHeCOIttvL1isTfrT1xK4c9aU5M3MzUp9a', 'Sonali', 'Joshi', 'employee', 'HR', 2, '2023-05-01'),
('EMP014', 'rohit@company.com', '$2b$10$Py3D04R4Pu2fEMOc3AjfHeCOIttvL1isTfrT1xK4c9aU5M3MzUp9a', 'Rohit', 'Mehta', 'employee', 'Sales', 2, '2023-05-10'),
('EMP015', 'kavita@company.com', '$2b$10$Py3D04R4Pu2fEMOc3AjfHeCOIttvL1isTfrT1xK4c9aU5M3MzUp9a', 'Kavita', 'Bansal', 'employee', 'Marketing', 2, '2023-05-15'),
('EMP016', 'Employee 16', 'employee16@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP017', 'Employee 17', 'employee17@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP018', 'Employee 18', 'employee18@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP019', 'Employee 19', 'employee19@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP020', 'Employee 20', 'employee20@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP021', 'Employee 21', 'employee21@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP022', 'Employee 22', 'employee22@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP023', 'Employee 23', 'employee23@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP024', 'Employee 24', 'employee24@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP025', 'Employee 25', 'employee25@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP026', 'Employee 26', 'employee26@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP027', 'Employee 27', 'employee27@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP028', 'Employee 28', 'employee28@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP029', 'Employee 29', 'employee29@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP030', 'Employee 30', 'employee30@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP031', 'Employee 31', 'employee31@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP032', 'Employee 32', 'employee32@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP033', 'Employee 33', 'employee33@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP034', 'Employee 34', 'employee34@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP035', 'Employee 35', 'employee35@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP036', 'Employee 36', 'employee36@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP037', 'Employee 37', 'employee37@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP038', 'Employee 38', 'employee38@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP039', 'Employee 39', 'employee39@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP040', 'Employee 40', 'employee40@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP041', 'Employee 41', 'employee41@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP042', 'Employee 42', 'employee42@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP043', 'Employee 43', 'employee43@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP044', 'Employee 44', 'employee44@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP045', 'Employee 45', 'employee45@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP046', 'Employee 46', 'employee46@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP047', 'Employee 47', 'employee47@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP048', 'Employee 48', 'employee48@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP049', 'Employee 49', 'employee49@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee'),
('EMP050', 'Employee 50', 'employee50@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8bY3OaYfK9Oe1Yj5h7YxD3YxD3YxD3', 'employee');
;

-- Initialize leave balances for all users and leave types for current year
INSERT OR IGNORE INTO leave_balances (user_id, leave_type_id, allocated_days, used_days, remaining_days)
SELECT u.id, lt.id, lt.days_per_year, 0, lt.days_per_year
FROM users u
CROSS JOIN leave_types lt
WHERE u.role IN ('employee', 'manager');
