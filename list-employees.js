const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

async function listEmployees() {
  const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
  const db = new sqlite3.Database(dbPath);
  
  console.log('👥 Employee Leave Management System - Employee Directory');
  console.log('=' .repeat(80));
  
  try {
    // Get all users with their details
    await new Promise((resolve, reject) => {
      db.all(`
        SELECT employee_id, first_name, last_name, email, role, department, hire_date
        FROM users 
        WHERE is_active = 1 
        ORDER BY role DESC, department, first_name
      `, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          let currentRole = '';
          let currentDept = '';
          
          rows.forEach((user, index) => {
            // Print role header
            if (user.role !== currentRole) {
              if (index > 0) console.log('');
              console.log(`\n🏢 ${user.role.toUpperCase()}S:`);
              console.log('-'.repeat(50));
              currentRole = user.role;
              currentDept = '';
            }
            
            // Print department header for employees
            if (user.role === 'employee' && user.department !== currentDept) {
              console.log(`\n📂 ${user.department} Department:`);
              currentDept = user.department;
            }
            
            // Print user details
            const roleIcon = getRoleIcon(user.role);
            const name = `${user.first_name} ${user.last_name}`;
            const empId = user.employee_id;
            const email = user.email;
            const hireDate = new Date(user.hire_date).toLocaleDateString();
            
            if (user.role === 'employee') {
              console.log(`   ${roleIcon} ${name.padEnd(20)} (${empId}) - ${email}`);
            } else {
              console.log(`${roleIcon} ${name.padEnd(25)} (${empId}) - ${email} - Hired: ${hireDate}`);
            }
          });
          
          resolve();
        }
      });
    });
    
    // Get statistics
    await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          role,
          department,
          COUNT(*) as count
        FROM users 
        WHERE is_active = 1 
        GROUP BY role, department
        ORDER BY role DESC, department
      `, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          console.log('\n');
          console.log('📊 EMPLOYEE STATISTICS');
          console.log('=' .repeat(80));
          
          let totalEmployees = 0;
          let totalManagers = 0;
          let totalAdmins = 0;
          const deptStats = {};
          
          rows.forEach(row => {
            if (row.role === 'admin') {
              totalAdmins += row.count;
            } else if (row.role === 'manager') {
              totalManagers += row.count;
            } else {
              totalEmployees += row.count;
              deptStats[row.department] = (deptStats[row.department] || 0) + row.count;
            }
          });
          
          console.log(`\n👑 Administrators: ${totalAdmins}`);
          console.log(`👨‍💼 Managers: ${totalManagers}`);
          console.log(`👥 Employees: ${totalEmployees}`);
          console.log(`🏢 Total Staff: ${totalAdmins + totalManagers + totalEmployees}`);
          
          console.log('\n📈 Department-wise Employee Distribution:');
          Object.keys(deptStats).sort().forEach(dept => {
            console.log(`   ${dept}: ${deptStats[dept]} employees`);
          });
          
          console.log('\n🔐 LOGIN INFORMATION:');
          console.log('-'.repeat(50));
          console.log('🌐 Application URL: http://localhost:3001');
          console.log('🔑 Default Password for all employees: employee123');
          console.log('🔑 Manager Password: manager123');
          console.log('🔑 Admin Password: admin123');
          
          resolve();
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Error listing employees:', error);
  } finally {
    db.close();
    console.log('\n✅ Employee directory listing completed.');
  }
}

function getRoleIcon(role) {
  switch(role) {
    case 'admin': return '👑';
    case 'manager': return '👨‍💼';
    case 'employee': return '👥';
    default: return '👤';
  }
}

if (require.main === module) {
  listEmployees();
}

module.exports = listEmployees;
