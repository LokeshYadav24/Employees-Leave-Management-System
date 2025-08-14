const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

async function addIndianEmployees() {
  const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
  const db = new sqlite3.Database(dbPath);
  
  console.log('🔄 Adding 47 Indian employees...');
  
  try {
    // Generate password hash for all employees (password: employee123)
    const employeeHash = await bcrypt.hash('employee123', 10);
    
    // Indian employees data with diverse names and departments
    const indianEmployees = [
      // IT Department
      { empId: 'EMP051', firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.sharma@company.com', department: 'IT' },
      { empId: 'EMP052', firstName: 'Vivaan', lastName: 'Patel', email: 'vivaan.patel@company.com', department: 'IT' },
      { empId: 'EMP053', firstName: 'Aditya', lastName: 'Singh', email: 'aditya.singh@company.com', department: 'IT' },
      { empId: 'EMP054', firstName: 'Vihaan', lastName: 'Kumar', email: 'vihaan.kumar@company.com', department: 'IT' },
      { empId: 'EMP055', firstName: 'Arjun', lastName: 'Gupta', email: 'arjun.gupta@company.com', department: 'IT' },
      { empId: 'EMP056', firstName: 'Sai', lastName: 'Reddy', email: 'sai.reddy@company.com', department: 'IT' },
      { empId: 'EMP057', firstName: 'Reyansh', lastName: 'Agarwal', email: 'reyansh.agarwal@company.com', department: 'IT' },
      { empId: 'EMP058', firstName: 'Ayaan', lastName: 'Jain', email: 'ayaan.jain@company.com', department: 'IT' },
      
      // HR Department
      { empId: 'EMP059', firstName: 'Saanvi', lastName: 'Verma', email: 'saanvi.verma@company.com', department: 'HR' },
      { empId: 'EMP060', firstName: 'Ananya', lastName: 'Nair', email: 'ananya.nair@company.com', department: 'HR' },
      { empId: 'EMP061', firstName: 'Diya', lastName: 'Tiwari', email: 'diya.tiwari@company.com', department: 'HR' },
      { empId: 'EMP062', firstName: 'Aadhya', lastName: 'Chopra', email: 'aadhya.chopra@company.com', department: 'HR' },
      { empId: 'EMP063', firstName: 'Kavya', lastName: 'Bansal', email: 'kavya.bansal@company.com', department: 'HR' },
      { empId: 'EMP064', firstName: 'Arya', lastName: 'Mehta', email: 'arya.mehta@company.com', department: 'HR' },
      { empId: 'EMP065', firstName: 'Navya', lastName: 'Pandey', email: 'navya.pandey@company.com', department: 'HR' },
      
      // Sales Department
      { empId: 'EMP066', firstName: 'Krishna', lastName: 'Yadav', email: 'krishna.yadav@company.com', department: 'Sales' },
      { empId: 'EMP067', firstName: 'Aryan', lastName: 'Mishra', email: 'aryan.mishra@company.com', department: 'Sales' },
      { empId: 'EMP068', firstName: 'Ishaan', lastName: 'Saxena', email: 'ishaan.saxena@company.com', department: 'Sales' },
      { empId: 'EMP069', firstName: 'Shivansh', lastName: 'Srivastava', email: 'shivansh.srivastava@company.com', department: 'Sales' },
      { empId: 'EMP070', firstName: 'Mohammad', lastName: 'Ali', email: 'mohammad.ali@company.com', department: 'Sales' },
      { empId: 'EMP071', firstName: 'Advait', lastName: 'Kapoor', email: 'advait.kapoor@company.com', department: 'Sales' },
      { empId: 'EMP072', firstName: 'Atharv', lastName: 'Bhatia', email: 'atharv.bhatia@company.com', department: 'Sales' },
      { empId: 'EMP073', firstName: 'Rudra', lastName: 'Malhotra', email: 'rudra.malhotra@company.com', department: 'Sales' },
      
      // Marketing Department
      { empId: 'EMP074', firstName: 'Myra', lastName: 'Kulkarni', email: 'myra.kulkarni@company.com', department: 'Marketing' },
      { empId: 'EMP075', firstName: 'Aanya', lastName: 'Joshi', email: 'aanya.joshi@company.com', department: 'Marketing' },
      { empId: 'EMP076', firstName: 'Pihu', lastName: 'Deshmukh', email: 'pihu.deshmukh@company.com', department: 'Marketing' },
      { empId: 'EMP077', firstName: 'Prisha', lastName: 'Bhatt', email: 'prisha.bhatt@company.com', department: 'Marketing' },
      { empId: 'EMP078', firstName: 'Anvi', lastName: 'Thakur', email: 'anvi.thakur@company.com', department: 'Marketing' },
      { empId: 'EMP079', firstName: 'Riya', lastName: 'Choudhary', email: 'riya.choudhary@company.com', department: 'Marketing' },
      { empId: 'EMP080', firstName: 'Khushi', lastName: 'Rajput', email: 'khushi.rajput@company.com', department: 'Marketing' },
      
      // Finance Department
      { empId: 'EMP081', firstName: 'Om', lastName: 'Shukla', email: 'om.shukla@company.com', department: 'Finance' },
      { empId: 'EMP082', firstName: 'Devam', lastName: 'Tripathi', email: 'devam.tripathi@company.com', department: 'Finance' },
      { empId: 'EMP083', firstName: 'Shaurya', lastName: 'Pathak', email: 'shaurya.pathak@company.com', department: 'Finance' },
      { empId: 'EMP084', firstName: 'Parth', lastName: 'Awasthi', email: 'parth.awasthi@company.com', department: 'Finance' },
      { empId: 'EMP085', firstName: 'Kartik', lastName: 'Dwivedi', email: 'kartik.dwivedi@company.com', department: 'Finance' },
      { empId: 'EMP086', firstName: 'Kairav', lastName: 'Sinha', email: 'kairav.sinha@company.com', department: 'Finance' },
      { empId: 'EMP087', firstName: 'Ayush', lastName: 'Rastogi', email: 'ayush.rastogi@company.com', department: 'Finance' },
      
      // Operations Department
      { empId: 'EMP088', firstName: 'Larisa', lastName: 'Menon', email: 'larisa.menon@company.com', department: 'Operations' },
      { empId: 'EMP089', firstName: 'Kiara', lastName: 'Iyer', email: 'kiara.iyer@company.com', department: 'Operations' },
      { empId: 'EMP090', firstName: 'Sara', lastName: 'Pillai', email: 'sara.pillai@company.com', department: 'Operations' },
      { empId: 'EMP091', firstName: 'Zara', lastName: 'Sethi', email: 'zara.sethi@company.com', department: 'Operations' },
      { empId: 'EMP092', firstName: 'Ira', lastName: 'Gill', email: 'ira.gill@company.com', department: 'Operations' },
      { empId: 'EMP093', firstName: 'Tara', lastName: 'Bora', email: 'tara.bora@company.com', department: 'Operations' },
      
      // Additional IT employees
      { empId: 'EMP094', firstName: 'Kabir', lastName: 'Mahajan', email: 'kabir.mahajan@company.com', department: 'IT' },
      { empId: 'EMP095', firstName: 'Ritesh', lastName: 'Kaushik', email: 'ritesh.kaushik@company.com', department: 'IT' },
      { empId: 'EMP096', firstName: 'Nikhil', lastName: 'Saini', email: 'nikhil.saini@company.com', department: 'IT' },
      { empId: 'EMP097', firstName: 'Rohan', lastName: 'Rawat', email: 'rohan.rawat@company.com', department: 'IT' },
      
      // Additional mixed departments
      { empId: 'EMP098', firstName: 'Ishita', lastName: 'Bhardwaj', email: 'ishita.bhardwaj@company.com', department: 'HR' },
      { empId: 'EMP099', firstName: 'Tanvi', lastName: 'Chauhan', email: 'tanvi.chauhan@company.com', department: 'Marketing' },
      { empId: 'EMP100', firstName: 'Aditi', lastName: 'Goyal', email: 'aditi.goyal@company.com', department: 'Finance' }
    ];
    
    console.log(`Adding ${indianEmployees.length} Indian employees...`);
    
    // Insert employees one by one
    for (let i = 0; i < indianEmployees.length; i++) {
      const emp = indianEmployees[i];
      const hireDate = getRandomHireDate();
      
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR IGNORE INTO users (employee_id, email, password, first_name, last_name, role, department, manager_id, hire_date) 
           VALUES (?, ?, ?, ?, ?, 'employee', ?, 2, ?)`,
          [emp.empId, emp.email, employeeHash, emp.firstName, emp.lastName, emp.department, hireDate],
          function(err) {
            if (err) {
              console.error(`❌ Error adding ${emp.firstName} ${emp.lastName}:`, err.message);
              reject(err);
            } else {
              console.log(`✅ Added ${emp.firstName} ${emp.lastName} (${emp.empId}) - ${emp.department}`);
              resolve();
            }
          }
        );
      });
    }
    
    // Initialize leave balances for all new employees
    console.log('\\n🔄 Initializing leave balances for new employees...');
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO leave_balances (user_id, leave_type_id, allocated_days, used_days, remaining_days)
         SELECT u.id, lt.id, lt.days_per_year, 0, lt.days_per_year
         FROM users u
         CROSS JOIN leave_types lt
         WHERE u.role = 'employee' AND u.id NOT IN (
           SELECT DISTINCT user_id FROM leave_balances
         )`,
        function(err) {
          if (err) {
            reject(err);
          } else {
            console.log('✅ Leave balances initialized for new employees');
            resolve();
          }
        }
      );
    });
    
    // Show final statistics
    await new Promise((resolve, reject) => {
      db.all('SELECT department, COUNT(*) as count FROM users WHERE role = "employee" GROUP BY department', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          console.log('\\n📊 Employee Distribution by Department:');
          rows.forEach(row => {
            console.log(`   ${row.department}: ${row.count} employees`);
          });
          resolve();
        }
      });
    });
    
    await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as total FROM users WHERE role = "employee"', [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          console.log(`\\n📋 Total Employees: ${row.total}`);
          console.log('\\n🎉 Successfully added 47 Indian employees!');
          console.log('\\nAll employees can login with password: employee123');
          resolve();
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Error adding Indian employees:', error);
  } finally {
    db.close();
  }
}

// Generate random hire date between 2023-01-01 and 2024-12-31
function getRandomHireDate() {
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2024-12-31');
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  const randomDate = new Date(randomTime);
  return randomDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
}

if (require.main === module) {
  addIndianEmployees();
}

module.exports = addIndianEmployees;
