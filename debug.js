const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');

async function debugDatabase() {
  const db = new sqlite3.Database(dbPath);
  
  console.log('🔍 Checking database contents...');
  
  // Check users table
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      console.error('Error reading users:', err.message);
      return;
    }
    
    console.log('\n👥 Users in database:');
    rows.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - Password hash: ${user.password.substring(0, 20)}...`);
    });
    
    console.log('\n🔐 Generating correct password hashes...');
    
    // Generate correct password hashes
    const passwords = {
      'admin123': null,
      'manager123': null,
      'employee123': null
    };
    
    const hashPromises = Object.keys(passwords).map(async (password) => {
      const hash = await bcrypt.hash(password, 10);
      passwords[password] = hash;
      console.log(`${password}: ${hash}`);
    });
    
    Promise.all(hashPromises).then(() => {
      console.log('\n🔄 Updating password hashes in database...');
      
      // Update admin password
      db.run(
        'UPDATE users SET password = ? WHERE email = ?',
        [passwords['admin123'], 'admin@company.com'],
        function(err) {
          if (err) console.error('Error updating admin:', err);
          else console.log('✅ Updated admin password');
        }
      );
      
      // Update manager password  
      db.run(
        'UPDATE users SET password = ? WHERE email = ?',
        [passwords['manager123'], 'manager@company.com'],
        function(err) {
          if (err) console.error('Error updating manager:', err);
          else console.log('✅ Updated manager password');
        }
      );
      
      // Update ALL employee passwords
      db.all('SELECT email FROM users WHERE role = "employee" AND is_active = 1', [], (err, employees) => {
        if (err) {
          console.error('Error fetching employees:', err);
          return;
        }
        
        employees.forEach(employee => {
          db.run(
            'UPDATE users SET password = ? WHERE email = ?',
            [passwords['employee123'], employee.email],
            function(err) {
              if (err) console.error(`Error updating ${employee.email}:`, err);
              else console.log(`✅ Updated ${employee.email} password`);
            }
          );
        });
      });
      
      // Test login after a delay
      setTimeout(() => {
        console.log('\n🧪 Testing login...');
        testLogin('admin@company.com', 'admin123');
      }, 1000);
    });
  });
}

function testLogin(email, password) {
  const db = new sqlite3.Database(dbPath);
  
  db.get('SELECT * FROM users WHERE email = ? AND is_active = 1', [email], async (err, user) => {
    if (err) {
      console.error('Database error:', err.message);
      return;
    }
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log(`📧 Found user: ${user.email}`);
    console.log(`🔑 Stored hash: ${user.password.substring(0, 30)}...`);
    
    try {
      const validPassword = await bcrypt.compare(password, user.password);
      console.log(`🔐 Password valid: ${validPassword}`);
      
      if (validPassword) {
        console.log('✅ Login would succeed!');
      } else {
        console.log('❌ Password comparison failed');
      }
    } catch (error) {
      console.error('Bcrypt error:', error.message);
    }
    
    db.close();
  });
}

debugDatabase();
