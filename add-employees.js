const dbAsync = require('./models/database');
const bcrypt = require('bcryptjs');

// List of 50 Indian names with first and last names
const indianEmployees = [
  { firstName: 'Lokesh', lastName: 'Yadav' },
  { firstName: 'Mayank', lastName: 'Yadav' },
  { firstName: 'Mohini', lastName: 'Yadav' },
  { firstName: 'Neha', lastName: 'Yadav' },
  { firstName: 'Vijay', lastName: 'Rao' },
  { firstName: 'Anita', lastName: 'Kumar' },
  { firstName: 'Deepak', lastName: 'Mishra' },
  { firstName: 'Sonali', lastName: 'Joshi' },
  { firstName: 'Rohit', lastName: 'Mehta' },
  { firstName: 'Kavita', lastName: 'Bansal' },
  { firstName: 'Amit', lastName: 'Singh' },
  { firstName: 'Pallavi', lastName: 'Saxena' },
  { firstName: 'Suresh', lastName: 'Chopra' },
  { firstName: 'Rekha', lastName: 'Agarwal' },
  { firstName: 'Gautam', lastName: 'Kapoor' },
  { firstName: 'Manisha', lastName: 'Bhatia' },
  { firstName: 'Ajay', lastName: 'Choudhary' },
  { firstName: 'Swati', lastName: 'Jain' },
  { firstName: 'Harish', lastName: 'Tripathi' },
  { firstName: 'Anjali', lastName: 'Pathak' },
  { firstName: 'Manoj', lastName: 'Rastogi' },
  { firstName: 'Seema', lastName: 'Pandey' },
  { firstName: 'Vivek', lastName: 'Nair' },
  { firstName: 'Poonam', lastName: 'Malhotra' },
  { firstName: 'Ashok', lastName: 'Kulkarni' },
  { firstName: 'Meena', lastName: 'Thakur' },
  { firstName: 'Rakesh', lastName: 'Deshmukh' },
  { firstName: 'Pooja', lastName: 'Gupta' },
  { firstName: 'Yogesh', lastName: 'Rawat' },
  { firstName: 'Vandana', lastName: 'Tiwari' },
  { firstName: 'Sanjay', lastName: 'Pawar' },
  { firstName: 'Shruti', lastName: 'Chauhan' },
  { firstName: 'Alok', lastName: 'Bhatt' },
  { firstName: 'Ritu', lastName: 'Awasthi' },
  { firstName: 'Dinesh', lastName: 'Yadav' },
  { firstName: 'Alka', lastName: 'Bora' },
  { firstName: 'Tarun', lastName: 'Mahajan' },
  { firstName: 'Sneha', lastName: 'Kaushik' },
  { firstName: 'Ravindra', lastName: 'Saini' },
  { firstName: 'Meenakshi', lastName: 'Rajput' },
  { firstName: 'Parveen', lastName: 'Gill' },
  { firstName: 'Suman', lastName: 'Bedi' },
  { firstName: 'Kamal', lastName: 'Menon' },
  { firstName: 'Bhavna', lastName: 'Sekhon' },
  { firstName: 'Hemant', lastName: 'Joshi' },
  { firstName: 'Kiran', lastName: 'Sharma' },
  { firstName: 'Naveen', lastName: 'Reddy' },
  { firstName: 'Sunita', lastName: 'Ghosh' },
  { firstName: 'Rajesh', lastName: 'Iyer' },
  { firstName: 'Madhuri', lastName: 'Sinha' }
];

const departments = ['IT', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations'];

async function addEmployees() {
  try {
    console.log('🔍 Checking current employee count...');
    
    // Check current employee count
    const currentCount = await dbAsync.get('SELECT COUNT(*) as count FROM users WHERE role = "employee"');
    console.log(`📊 Current employee count: ${currentCount.count}`);
    
    // Get the highest employee ID to continue numbering
    const maxEmployeeId = await dbAsync.get('SELECT employee_id FROM users ORDER BY CAST(SUBSTR(employee_id, 4) AS INTEGER) DESC LIMIT 1');
    let nextEmployeeNumber = 1;
    
    if (maxEmployeeId && maxEmployeeId.employee_id) {
      const currentNumber = parseInt(maxEmployeeId.employee_id.replace('EMP', ''));
      nextEmployeeNumber = currentNumber + 1;
    }
    
    console.log(`🆔 Starting from employee ID: EMP${nextEmployeeNumber.toString().padStart(3, '0')}`);
    
    // Hash password for all employees (password: employee123)
    const hashedPassword = await bcrypt.hash('employee123', 10);
    
    console.log('👥 Adding 50 Indian employees...');
    
    // Manager ID (assuming manager exists with ID 2)
    const managerId = 2;
    
    for (let i = 0; i < indianEmployees.length; i++) {
      const employee = indianEmployees[i];
      const employeeId = `EMP${(nextEmployeeNumber + i).toString().padStart(3, '0')}`;
      const email = `${employee.firstName.toLowerCase()}${employee.lastName.toLowerCase()}@company.com`;
      const department = departments[i % departments.length];
      
      // Generate a realistic hire date (within last 2 years)
      const startDate = new Date('2022-01-01');
      const endDate = new Date('2024-08-01');
      const hireDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      const hireDateString = hireDate.toISOString().split('T')[0];
      
      try {
        const result = await dbAsync.run(`
          INSERT INTO users (employee_id, email, password, first_name, last_name, role, department, manager_id, hire_date)
          VALUES (?, ?, ?, ?, ?, 'employee', ?, ?, ?)
        `, [employeeId, email, hashedPassword, employee.firstName, employee.lastName, department, managerId, hireDateString]);
        
        console.log(`✅ Added: ${employee.firstName} ${employee.lastName} (${employeeId}) - ${department}`);
        
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`⚠️  Skipped: ${employee.firstName} ${employee.lastName} - already exists`);
        } else {
          console.error(`❌ Error adding ${employee.firstName} ${employee.lastName}:`, error.message);
        }
      }
    }
    
    // Initialize leave balances for new employees
    console.log('🏖️  Initializing leave balances for new employees...');
    await dbAsync.run(`
      INSERT OR IGNORE INTO leave_balances (user_id, leave_type_id, allocated_days, used_days, remaining_days)
      SELECT u.id, lt.id, lt.days_per_year, 0, lt.days_per_year
      FROM users u
      CROSS JOIN leave_types lt
      WHERE u.role = 'employee' 
      AND u.id NOT IN (SELECT DISTINCT user_id FROM leave_balances)
    `);
    
    // Final count
    const finalCount = await dbAsync.get('SELECT COUNT(*) as count FROM users WHERE role = "employee"');
    console.log(`🎉 Final employee count: ${finalCount.count}`);
    console.log('✅ All employees added successfully!');
    
    // Display some sample login credentials
    console.log('\n📋 Sample login credentials for new employees:');
    console.log('Email format: firstname.lastname@company.com');
    console.log('Password for all employees: employee123');
    console.log('\nExamples:');
    for (let i = 0; i < 5; i++) {
      const emp = indianEmployees[i];
      console.log(`• ${emp.firstName} ${emp.lastName}: ${emp.firstName.toLowerCase()}${emp.lastName.toLowerCase()}@company.com`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
addEmployees();
