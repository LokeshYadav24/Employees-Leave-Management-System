const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');

async function quickLoginTest() {
  const db = new sqlite3.Database(dbPath);
  
  console.log('🔍 Quick Login Diagnostic Test');
  console.log('=' .repeat(50));
  
  try {
    // Test a few specific employees
    const testUsers = [
      { email: 'lokesh@company.com', password: 'employee123' },
      { email: 'mayank@company.com', password: 'employee123' },
      { email: 'mohini@company.com', password: 'employee123' },
      { email: 'aarav.sharma@company.com', password: 'employee123' },
      { email: 'admin@company.com', password: 'admin123' },
      { email: 'manager@company.com', password: 'manager123' }
    ];
    
    console.log('Testing login for specific users...\n');
    
    for (const testUser of testUsers) {
      console.log(`Testing: ${testUser.email}`);
      
      // Get user from database
      const user = await getRow(db, 
        'SELECT * FROM users WHERE email = ? AND is_active = 1', 
        [testUser.email]
      );
      
      if (!user) {
        console.log(`❌ User not found: ${testUser.email}\n`);
        continue;
      }
      
      console.log(`   📧 Found user: ${user.first_name} ${user.last_name}`);
      console.log(`   🆔 Employee ID: ${user.employee_id}`);
      console.log(`   🏢 Department: ${user.department || 'N/A'}`);
      console.log(`   👤 Role: ${user.role}`);
      console.log(`   🔑 Password hash: ${user.password.substring(0, 30)}...`);
      
      try {
        const passwordValid = await bcrypt.compare(testUser.password, user.password);
        if (passwordValid) {
          console.log(`   ✅ LOGIN SUCCESS for ${testUser.email}`);
        } else {
          console.log(`   ❌ LOGIN FAILED - Wrong password for ${testUser.email}`);
          
          // Try to generate a new hash and compare
          const newHash = await bcrypt.hash(testUser.password, 10);
          console.log(`   🔄 New hash would be: ${newHash.substring(0, 30)}...`);
        }
      } catch (error) {
        console.log(`   ❌ BCRYPT ERROR: ${error.message}`);
      }
      
      console.log(''); // Empty line
    }
    
    // Check total user count
    const totalUsers = await getRow(db, 'SELECT COUNT(*) as count FROM users WHERE is_active = 1');
    console.log(`📊 Total active users in database: ${totalUsers.count}`);
    
    // Check if database file exists
    console.log(`📁 Database file path: ${dbPath}`);
    console.log(`📁 Database file exists: ${require('fs').existsSync(dbPath)}`);
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    db.close();
  }
}

function getRow(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

quickLoginTest();
