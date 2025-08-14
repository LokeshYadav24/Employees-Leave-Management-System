const dbAsync = require('./models/database');

async function listAllUsers() {
  try {
    console.log('🔍 Retrieving all user credentials...\n');
    
    // Get all users with their details
    const users = await dbAsync.all(`
      SELECT employee_id, email, first_name, last_name, role, department, hire_date, is_active
      FROM users 
      ORDER BY 
        CASE role 
          WHEN 'admin' THEN 1 
          WHEN 'manager' THEN 2 
          WHEN 'employee' THEN 3 
        END,
        CAST(SUBSTR(employee_id, 4) AS INTEGER)
    `);
    
    console.log(`📊 Total users found: ${users.length}\n`);
    
    // Group by role
    const usersByRole = {
      admin: users.filter(u => u.role === 'admin'),
      manager: users.filter(u => u.role === 'manager'),
      employee: users.filter(u => u.role === 'employee')
    };
    
    // Display Admin users
    if (usersByRole.admin.length > 0) {
      console.log('👑 ADMIN USERS');
      console.log('='.repeat(80));
      console.log('| Employee ID | Name                    | Email                      | Password    | Department |');
      console.log('|-------------|-------------------------|----------------------------|-------------|------------|');
      
      usersByRole.admin.forEach(user => {
        const name = `${user.first_name} ${user.last_name}`.padEnd(23);
        const email = user.email.padEnd(26);
        const empId = user.employee_id.padEnd(11);
        const dept = (user.department || 'N/A').padEnd(10);
        console.log(`| ${empId} | ${name} | ${email} | admin123    | ${dept} |`);
      });
      console.log('\n');
    }
    
    // Display Manager users
    if (usersByRole.manager.length > 0) {
      console.log('👔 MANAGER USERS');
      console.log('='.repeat(80));
      console.log('| Employee ID | Name                    | Email                      | Password     | Department |');
      console.log('|-------------|-------------------------|----------------------------|--------------|------------|');
      
      usersByRole.manager.forEach(user => {
        const name = `${user.first_name} ${user.last_name}`.padEnd(23);
        const email = user.email.padEnd(26);
        const empId = user.employee_id.padEnd(11);
        const dept = (user.department || 'N/A').padEnd(10);
        console.log(`| ${empId} | ${name} | ${email} | manager123   | ${dept} |`);
      });
      console.log('\n');
    }
    
    // Display Employee users (first 10 and then summary)
    if (usersByRole.employee.length > 0) {
      console.log('👥 EMPLOYEE USERS');
      console.log('='.repeat(80));
      console.log('| Employee ID | Name                    | Email                      | Password     | Department |');
      console.log('|-------------|-------------------------|----------------------------|--------------|------------|');
      
      // Show first 15 employees
      const displayCount = Math.min(15, usersByRole.employee.length);
      for (let i = 0; i < displayCount; i++) {
        const user = usersByRole.employee[i];
        const name = `${user.first_name} ${user.last_name}`.padEnd(23);
        const email = user.email.padEnd(26);
        const empId = user.employee_id.padEnd(11);
        const dept = (user.department || 'N/A').padEnd(10);
        console.log(`| ${empId} | ${name} | ${email} | employee123  | ${dept} |`);
      }
      
      if (usersByRole.employee.length > 15) {
        console.log('|-------------|-------------------------|----------------------------|--------------|------------|');
        console.log(`| ... and ${usersByRole.employee.length - 15} more employees with the same password pattern`);
      }
      console.log('\n');
    }
    
    // Summary by department
    console.log('📊 SUMMARY BY DEPARTMENT');
    console.log('='.repeat(40));
    const deptCounts = {};
    users.forEach(user => {
      const dept = user.department || 'N/A';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });
    
    Object.entries(deptCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([dept, count]) => {
        console.log(`${dept.padEnd(15)}: ${count} users`);
      });
    
    console.log('\n' + '='.repeat(80));
    console.log('🔑 PASSWORD SUMMARY:');
    console.log('• Admin users: admin123');
    console.log('• Manager users: manager123');  
    console.log('• Employee users: employee123');
    console.log('='.repeat(80));
    
    // Create a simple CSV export
    console.log('\n📄 Creating user list CSV file...');
    const csvContent = [
      'Employee_ID,Email,First_Name,Last_Name,Role,Department,Password,Hire_Date',
      ...users.map(user => {
        const password = user.role === 'admin' ? 'admin123' : 
                        user.role === 'manager' ? 'manager123' : 'employee123';
        return `${user.employee_id},${user.email},${user.first_name},${user.last_name},${user.role},${user.department || 'N/A'},${password},${user.hire_date}`;
      })
    ].join('\n');
    
    require('fs').writeFileSync('user_credentials.csv', csvContent);
    console.log('✅ User credentials exported to user_credentials.csv');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
listAllUsers();
