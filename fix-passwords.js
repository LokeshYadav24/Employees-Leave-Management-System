const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

async function fixPasswords() {
  const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
  const db = new sqlite3.Database(dbPath);
  
  console.log('🔄 Fixing user passwords...');
  
  try {
    // Generate new password hashes
    const adminHash = await bcrypt.hash('admin123', 10);
    const managerHash = await bcrypt.hash('manager123', 10);
    const employeeHash = await bcrypt.hash('employee123', 10);
    
    console.log('Generated password hashes:');
    console.log('Admin hash:', adminHash);
    console.log('Manager hash:', managerHash);
    console.log('Employee hash:', employeeHash);
    
    // Update admin password
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET password = ? WHERE email = ?',
        [adminHash, 'admin@company.com'],
        function(err) {
          if (err) reject(err);
          else {
            console.log('✅ Updated admin password');
            resolve();
          }
        }
      );
    });
    
    // Update manager password
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET password = ? WHERE email = ?',
        [managerHash, 'manager@company.com'],
        function(err) {
          if (err) reject(err);
          else {
            console.log('✅ Updated manager password');
            resolve();
          }
        }
      );
    });
    
    // Update ALL employee passwords
    await new Promise((resolve, reject) => {
      db.all('SELECT email FROM users WHERE role = "employee" AND is_active = 1', [], async (err, employees) => {
        if (err) {
          reject(err);
          return;
        }
        
        console.log(`Found ${employees.length} employees to update`);
        
        try {
          for (const employee of employees) {
            await new Promise((resolveUpdate, rejectUpdate) => {
              db.run(
                'UPDATE users SET password = ? WHERE email = ?',
                [employeeHash, employee.email],
                function(err) {
                  if (err) rejectUpdate(err);
                  else {
                    console.log(`✅ Updated password for ${employee.email}`);
                    resolveUpdate();
                  }
                }
              );
            });
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
    
    // Verify users exist
    await new Promise((resolve, reject) => {
      db.all('SELECT email, role FROM users WHERE is_active = 1', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          console.log('\\n📋 Active users in database:');
          rows.forEach(user => {
            console.log(`- ${user.email} (${user.role})`);
          });
          resolve();
        }
      });
    });
    
    console.log('\\n🎉 Password fix completed successfully!');
    console.log('\\n📋 Login Credentials:');
    console.log('👑 Admin - Email: admin@company.com, Password: admin123');
    console.log('👨‍💼 Manager - Email: manager@company.com, Password: manager123');
    console.log('👥 ALL Employees - Use their email address, Password: employee123');
    console.log('\\n💡 All 55+ employees can now log in with their email and "employee123"');
    
  } catch (error) {
    console.error('❌ Error fixing passwords:', error);
  } finally {
    db.close();
  }
}

if (require.main === module) {
  fixPasswords();
}

module.exports = fixPasswords;
