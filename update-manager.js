const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');

function updateManagerName() {
  const db = new sqlite3.Database(dbPath);
  
  console.log('🔄 Updating manager name from John to Rakesh...');
  
  // Update the manager's name
  db.run(
    'UPDATE users SET first_name = ? WHERE email = ? AND role = ?',
    ['Rakesh', 'manager@company.com', 'manager'],
    function(err) {
      if (err) {
        console.error('❌ Error updating manager name:', err.message);
      } else {
        console.log('✅ Successfully updated manager name to Rakesh');
        console.log(`📊 Rows affected: ${this.changes}`);
        
        // Verify the change
        db.get(
          'SELECT first_name, last_name, email, role FROM users WHERE email = ?',
          ['manager@company.com'],
          (err, row) => {
            if (err) {
              console.error('Error verifying update:', err.message);
            } else if (row) {
              console.log('✅ Verification - Manager details:');
              console.log(`   Name: ${row.first_name} ${row.last_name}`);
              console.log(`   Email: ${row.email}`);
              console.log(`   Role: ${row.role}`);
            } else {
              console.log('❌ Manager not found during verification');
            }
            
            db.close();
          }
        );
      }
    }
  );
}

updateManagerName();
