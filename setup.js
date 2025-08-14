const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
  
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Failed to connect to SQLite database:', err.message);
        reject(err);
        return;
      }
      console.log('📡 Connected to SQLite database');
      
      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON');
      
      try {
        console.log('🔄 Executing SQL statements...');
        
        // Define all SQL statements as individual queries
        const sqlStatements = [
          // Create tables
          `CREATE TABLE IF NOT EXISTS users (
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
          )`,
          
          `CREATE TABLE IF NOT EXISTS leave_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            days_per_year INTEGER NOT NULL,
            description TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )`,
          
          `CREATE TABLE IF NOT EXISTS leave_balances (
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
          )`,
          
          `CREATE TABLE IF NOT EXISTS leave_requests (
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
          )`,
          
          // Insert default leave types
          `INSERT OR IGNORE INTO leave_types (id, name, days_per_year, description) VALUES
          (1, 'Annual Leave', 25, 'Yearly vacation days'),
          (2, 'Sick Leave', 10, 'Medical leave for illness'),
          (3, 'Personal Leave', 5, 'Personal time off'),
          (4, 'Emergency Leave', 3, 'Emergency situations'),
          (5, 'Maternity Leave', 90, 'Maternity leave for new mothers'),
          (6, 'Paternity Leave', 15, 'Paternity leave for new fathers')`,
          
          // Insert admin user
          `INSERT OR IGNORE INTO users (id, employee_id, email, password, first_name, last_name, role, department, hire_date) VALUES
          (1, 'EMP001', 'admin@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'System', 'Admin', 'admin', 'IT', '2023-01-01')`,
          
          // Insert manager
          `INSERT OR IGNORE INTO users (id, employee_id, email, password, first_name, last_name, role, department, manager_id, hire_date) VALUES
          (2, 'EMP002', 'manager@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Rakesh', 'Manager', 'manager', 'HR', 1, '2023-01-15')`,
          
          // Insert sample employees
          `INSERT OR IGNORE INTO users (employee_id, email, password, first_name, last_name, role, department, manager_id, hire_date) VALUES
          ('EMP003', 'lokesh@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Lokesh', 'Yadav', 'employee', 'IT', 2, '2023-02-01'),
          ('EMP004', 'mayank@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Mayank', 'Yadav', 'employee', 'IT', 2, '2023-02-15'),
          ('EMP005', 'mohini@company.com', '$2b$10$8YqB3hYKzHgKXHHJl/6w6.rYq8HdJ9dQGhQHlWgqG8wY.zHoM4QjK', 'Mohini', 'Yadav', 'employee', 'HR', 2, '2023-03-01')`,
          
          // Initialize leave balances
          `INSERT OR IGNORE INTO leave_balances (user_id, leave_type_id, allocated_days, used_days, remaining_days)
          SELECT u.id, lt.id, lt.days_per_year, 0, lt.days_per_year
          FROM users u
          CROSS JOIN leave_types lt
          WHERE u.role IN ('employee', 'manager')`
        ];
        
        // Execute each statement sequentially
        let currentIndex = 0;
        
        function executeNextStatement() {
          if (currentIndex >= sqlStatements.length) {
            console.log('🎉 Database setup completed successfully!');
            console.log('\n📋 Default Login Credentials:');
            console.log('👑 Admin - Email: admin@company.com, Password: admin123');
            console.log('👨‍💼 Manager - Email: manager@company.com, Password: manager123');
            console.log('👨‍💻 Employee 1 - Email: lokesh@company.com, Password: employee123');
            console.log('👩‍💻 Employee 2 - Email: mayank@company.com, Password: employee123');
            console.log('👨‍💻 Employee 3 - Email: mohini@company.com, Password: employee123');
            
            db.close((err) => {
              if (err) {
                console.error('Error closing database:', err.message);
                reject(err);
              } else {
                resolve();
              }
            });
            return;
          }
          
          const statement = sqlStatements[currentIndex];
          db.run(statement, (err) => {
            if (err) {
              console.error(`❌ Error executing statement ${currentIndex + 1}:`, err.message);
              reject(err);
            } else {
              console.log(`✅ Executed statement ${currentIndex + 1}/${sqlStatements.length}`);
              currentIndex++;
              executeNextStatement();
            }
          });
        }
        
        executeNextStatement();
        
      } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        reject(error);
      }
    });
  });
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase().catch(console.error);
}

module.exports = setupDatabase;
