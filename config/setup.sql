-- Create database
CREATE DATABASE IF NOT EXISTS leave_management;
USE leave_management;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role ENUM('employee', 'manager', 'admin') DEFAULT 'employee',
  department VARCHAR(50),
  manager_id INT,
  hire_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Leave types table
CREATE TABLE leave_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  days_per_year INT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leave balances table
CREATE TABLE leave_balances (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  leave_type_id INT NOT NULL,
  allocated_days DECIMAL(4,2) DEFAULT 0,
  used_days DECIMAL(4,2) DEFAULT 0,
  remaining_days DECIMAL(4,2) DEFAULT 0,
  year YEAR DEFAULT (YEAR(CURDATE())),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_leave_year (user_id, leave_type_id, year)
);

-- Leave requests table
CREATE TABLE leave_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  leave_type_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested DECIMAL(4,2) NOT NULL,
  reason TEXT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  manager_id INT,
  manager_comments TEXT,
  approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default leave types
INSERT INTO leave_types (name, days_per_year, description) VALUES
('Annual Leave', 25, 'Yearly vacation days'),
('Sick Leave', 10, 'Medical leave for illness'),
('Personal Leave', 5, 'Personal time off'),
('Emergency Leave', 3, 'Emergency situations'),
('Maternity Leave', 90, 'Maternity leave for new mothers'),
('Paternity Leave', 15, 'Paternity leave for new fathers');

-- Insert sample admin user (password: admin123)
INSERT INTO users (employee_id, email, password, first_name, last_name, role, department, hire_date) VALUES
('EMP001', 'admin@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'System', 'Admin', 'admin', 'IT', '2023-01-01');

-- Insert sample manager (password: manager123)
INSERT INTO users (employee_id, email, password, first_name, last_name, role, department, manager_id, hire_date) VALUES
('EMP002', 'manager@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'John', 'Manager', 'manager', 'HR', 1, '2023-01-15');

-- Insert sample employees (password: employee123)
INSERT INTO users (employee_id, email, password, first_name, last_name, role, department, manager_id, hire_date) VALUES
('EMP003', 'lokesh@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'lokesh', 'Yadav', 'employee', 'IT', 2, '2023-02-01'),
('EMP004', 'mayank@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'mayank', 'Yadav', 'employee', 'Marketing', 2, '2023-02-15'),
('EMP005', 'mohini@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Mohini', 'Yadav', 'employee', 'Sales', 2, '2023-03-01');

-- Initialize leave balances for all users and leave types for current year
INSERT INTO leave_balances (user_id, leave_type_id, allocated_days, used_days, remaining_days)
SELECT u.id, lt.id, lt.days_per_year, 0, lt.days_per_year
FROM users u
CROSS JOIN leave_types lt
WHERE u.role IN ('employee', 'manager');
