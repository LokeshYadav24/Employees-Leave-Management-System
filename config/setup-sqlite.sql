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

-- Insert sample admin user (password: admin123)
INSERT OR IGNORE INTO users (id, employee_id, email, password, first_name, last_name, role, department, hire_date) VALUES
(1, 'EMP001', 'admin@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'System', 'Admin', 'admin', 'IT', '2023-01-01');

-- Insert sample manager (password: manager123)
INSERT OR IGNORE INTO users (id, employee_id, email, password, first_name, last_name, role, department, manager_id, hire_date) VALUES
(2, 'EMP002', 'manager@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Rakesh', 'Manager', 'manager', 'HR', 1, '2023-01-15');

-- Insert sample employees (password: employee123)
-- Insert additional employees
INSERT OR IGNORE INTO users (employee_id, email, password, first_name, last_name, role, department, manager_id, hire_date) VALUES
('EMP006', 'arjun@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Arjun', 'Sharma', 'employee', 'IT', 2, '2023-03-15'),
('EMP007', 'priya@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Priya', 'Verma', 'employee', 'HR', 2, '2023-03-20'),
('EMP008', 'rahul@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Rahul', 'Gupta', 'employee', 'Sales', 2, '2023-04-01'),
('EMP009', 'neha@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Neha', 'Patel', 'employee', 'Marketing', 2, '2023-04-10'),
('EMP010', 'vijay@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Vijay', 'Rao', 'employee', 'Finance', 2, '2023-04-15'),
('EMP011', 'anita@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Anita', 'Kumar', 'employee', 'Operations', 2, '2023-04-20'),
('EMP012', 'deepak@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Deepak', 'Mishra', 'employee', 'IT', 2, '2023-04-25'),
('EMP013', 'sonali@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Sonali', 'Joshi', 'employee', 'HR', 2, '2023-05-01'),
('EMP014', 'rohit@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Rohit', 'Mehta', 'employee', 'Sales', 2, '2023-05-10'),
('EMP015', 'kavita@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Kavita', 'Bansal', 'employee', 'Marketing', 2, '2023-05-15'),
('EMP016', 'amit@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Amit', 'Singh', 'employee', 'Finance', 2, '2023-05-20'),
('EMP017', 'pallavi@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Pallavi', 'Saxena', 'employee', 'Operations', 2, '2023-05-25'),
('EMP018', 'suresh@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Suresh', 'Chopra', 'employee', 'IT', 2, '2023-06-01'),
('EMP019', 'rekha@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Rekha', 'Agarwal', 'employee', 'HR', 2, '2023-06-05'),
('EMP020', 'gautam@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Gautam', 'Kapoor', 'employee', 'Sales', 2, '2023-06-10'),
('EMP021', 'manisha@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Manisha', 'Bhatia', 'employee', 'Marketing', 2, '2023-06-15'),
('EMP022', 'ajay@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Ajay', 'Choudhary', 'employee', 'Finance', 2, '2023-06-20'),
('EMP023', 'swati@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Swati', 'Jain', 'employee', 'Operations', 2, '2023-06-25'),
('EMP024', 'harish@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Harish', 'Tripathi', 'employee', 'IT', 2, '2023-07-01'),
('EMP025', 'anjali@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Anjali', 'Pathak', 'employee', 'HR', 2, '2023-07-05'),
('EMP026', 'manoj@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Manoj', 'Rastogi', 'employee', 'Sales', 2, '2023-07-10'),
('EMP027', 'seema@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Seema', 'Pandey', 'employee', 'Marketing', 2, '2023-07-15'),
('EMP028', 'vivek@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Vivek', 'Nair', 'employee', 'Finance', 2, '2023-07-20'),
('EMP029', 'poonam@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Poonam', 'Malhotra', 'employee', 'Operations', 2, '2023-07-25'),
('EMP030', 'ashok@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Ashok', 'Kulkarni', 'employee', 'IT', 2, '2023-08-01'),
('EMP031', 'meena@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Meena', 'Thakur', 'employee', 'HR', 2, '2023-08-05'),
('EMP032', 'rakesh@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Rakesh', 'Deshmukh', 'employee', 'Sales', 2, '2023-08-10'),
('EMP033', 'rekhagupta@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Rekha', 'Gupta', 'employee', 'Marketing', 2, '2023-08-15'),
('EMP034', 'yogesh@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Yogesh', 'Rawat', 'employee', 'Finance', 2, '2023-08-20'),
('EMP035', 'vandana@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Vandana', 'Tiwari', 'employee', 'Operations', 2, '2023-08-25'),
('EMP036', 'sanjay@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Sanjay', 'Pawar', 'employee', 'IT', 2, '2023-09-01'),
('EMP037', 'shruti@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Shruti', 'Chauhan', 'employee', 'HR', 2, '2023-09-05'),
('EMP038', 'alok@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Alok', 'Bhatt', 'employee', 'Sales', 2, '2023-09-10'),
('EMP039', 'ritu@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Ritu', 'Awasthi', 'employee', 'Marketing', 2, '2023-09-15'),
('EMP040', 'dinesh@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Dinesh', 'Yadav', 'employee', 'Finance', 2, '2023-09-20'),
('EMP041', 'alka@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Alka', 'Bora', 'employee', 'Operations', 2, '2023-09-25'),
('EMP042', 'tarun@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Tarun', 'Mahajan', 'employee', 'IT', 2, '2023-10-01'),
('EMP043', 'sneha@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Sneha', 'Kaushik', 'employee', 'HR', 2, '2023-10-05'),
('EMP044', 'ravindra@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Ravindra', 'Saini', 'employee', 'Sales', 2, '2023-10-10'),
('EMP045', 'meenakshi@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Meenakshi', 'Rajput', 'employee', 'Marketing', 2, '2023-10-15'),
('EMP046', 'parveen@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Parveen', 'Gill', 'employee', 'Finance', 2, '2023-10-20'),
('EMP047', 'suman@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Suman', 'Bedi', 'employee', 'Operations', 2, '2023-10-25'),
('EMP048', 'kamal@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Kamal', 'Menon', 'employee', 'IT', 2, '2023-11-01'),
('EMP049', 'bhavna@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Bhavna', 'Sekhon', 'employee', 'HR', 2, '2023-11-05'),
('EMP050', 'hemant@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK',


-- Initialize leave balances for all users and leave types for current year
INSERT OR IGNORE INTO leave_balances (user_id, leave_type_id, allocated_days, used_days, remaining_days)
SELECT u.id, lt.id, lt.days_per_year, 0, lt.days_per_year
FROM users u
CROSS JOIN leave_types lt
WHERE u.role IN ('employee', 'manager');
