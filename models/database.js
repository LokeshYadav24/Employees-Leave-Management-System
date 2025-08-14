const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✓ Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Helper function to promisify database operations
const dbAsync = {
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
  
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  
  execute: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve([[], { insertId: this.lastID, affectedRows: this.changes }]);
      });
    });
  }
};

// Initialize database and tables
async function initializeDatabase() {
  try {
    console.log('🔄 Initializing SQLite database...');
    
    // Read and execute the setup SQL
    const setupSQLPath = path.join(__dirname, '..', 'config', 'setup-sqlite.sql');
    const setupSQL = fs.readFileSync(setupSQLPath, 'utf8');
    
    // Split SQL into individual statements and execute them
    const statements = setupSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await dbAsync.run(statement);
        } catch (error) {
          // Ignore errors for existing data (UNIQUE constraint violations)
          if (!error.message.includes('UNIQUE constraint failed')) {
            console.error('Error executing statement:', statement.substring(0, 50) + '...');
            console.error('Error:', error.message);
          }
        }
      }
    }
    
    console.log('✓ Database initialized successfully');
    
  } catch (error) {
    console.error('✗ Database initialization failed:', error.message);
  }
}

// Initialize database on startup
initializeDatabase();

module.exports = dbAsync;
