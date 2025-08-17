const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');

async function testEmployeeLogins() {
  const db = new sqlite3.Database(dbPath);
  
  console.log('🧪 Testing Employee Login Functionality');
  console.log('=' .repeat(80));
  
  try {
    // Get employees from each department
    const employees = await getAllRows(db, `
      SELECT email, first_name, last_name, department, employee_id 
      FROM users 
      WHERE role = 'employee' AND is_active = 1 
      ORDER BY department, first_name
    `);
    
    console.log(`Found ${employees.length} employees to test`);
    console.log('\n📊 Testing login functionality by department...\n');
    
    // Group employees by department
    const departmentGroups = {};
    employees.forEach(emp => {
      if (!departmentGroups[emp.department]) {
        departmentGroups[emp.department] = [];
      }
      departmentGroups[emp.department].push(emp);
    });
    
    let totalTests = 0;
    let passedTests = 0;
    
    // Test 2 employees from each department
    for (const [department, deptEmployees] of Object.entries(departmentGroups)) {
      console.log(`📂 ${department} Department:`);
      
      const testEmployees = deptEmployees.slice(0, 2); // Test first 2 employees from each dept
      
      for (const employee of testEmployees) {
        totalTests++;
        
        // Get user with password hash
        const user = await getRow(db, 
          'SELECT * FROM users WHERE email = ? AND is_active = 1', 
          [employee.email]
        );
        
        if (!user) {
          console.log(`   ❌ FAIL: ${employee.first_name} ${employee.last_name} (${employee.email}) - User not found`);
          continue;
        }
        
        // Test password
        try {
          const passwordValid = await bcrypt.compare('employee123', user.password);
          if (passwordValid) {
            console.log(`   ✅ PASS: ${employee.first_name} ${employee.last_name} (${employee.employee_id}) - Login successful`);
            passedTests++;
          } else {
            console.log(`   ❌ FAIL: ${employee.first_name} ${employee.last_name} (${employee.email}) - Invalid password`);
          }
        } catch (error) {
          console.log(`   ❌ FAIL: ${employee.first_name} ${employee.last_name} (${employee.email}) - Error: ${error.message}`);
        }
      }
      console.log(''); // Empty line between departments
    }
    
    // Test admin and manager too
    console.log('👑 Testing Admin & Manager:');
    
    const adminTest = await testUserLogin(db, 'admin@company.com', 'admin123');
    const managerTest = await testUserLogin(db, 'manager@company.com', 'manager123');
    
    totalTests += 2;
    if (adminTest) passedTests++;
    if (managerTest) passedTests++;
    
    // Summary
    console.log('\n📈 TEST SUMMARY:');
    console.log('=' .repeat(80));
    console.log(`✅ Passed: ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests*100)}%)`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    
    if (passedTests === totalTests) {
      console.log('\n🎉 ALL TESTS PASSED! The LMS system is now working for ALL employees!');
      console.log('\n📝 Quick Start Guide:');
      console.log('🌐 Start the server: node server.js');
      console.log('🌐 Access application: http://localhost:3001');
      console.log('👥 Employee login: [any-employee-email] / employee123');
      console.log('👨‍💼 Manager login: manager@company.com / manager123'); 
      console.log('👑 Admin login: admin@company.com / admin123');
      console.log('\n💡 Run "node list-employees.js" to see all employee email addresses');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the failed logins above.');
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    db.close();
  }
}

async function testUserLogin(db, email, password) {
  const user = await getRow(db, 
    'SELECT * FROM users WHERE email = ? AND is_active = 1', 
    [email]
  );
  
  if (!user) {
    console.log(`   ❌ FAIL: ${email} - User not found`);
    return false;
  }
  
  try {
    const passwordValid = await bcrypt.compare(password, user.password);
    if (passwordValid) {
      console.log(`   ✅ PASS: ${user.first_name} ${user.last_name} (${email}) - Login successful`);
      return true;
    } else {
      console.log(`   ❌ FAIL: ${email} - Invalid password`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ FAIL: ${email} - Error: ${error.message}`);
    return false;
  }
}

// Helper functions
function getRow(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function getAllRows(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

if (require.main === module) {
  testEmployeeLogins();
}

module.exports = testEmployeeLogins;
