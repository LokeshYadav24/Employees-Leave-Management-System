const https = require('https');
const http = require('http');

async function testWebAPI() {
  console.log('🌐 Testing Web API Endpoints');
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Check if server is responding
    console.log('1. Testing server connectivity...');
    const serverTest = await makeRequest('GET', 'http://localhost:3001');
    console.log(`   Status: ${serverTest.status}`);
    console.log(`   Response length: ${serverTest.data.length} characters`);
    
    if (serverTest.data.includes('Employee Leave Management')) {
      console.log('   ✅ Server is serving the main page correctly');
    } else {
      console.log('   ⚠️  Server response doesn\'t contain expected content');
    }
    
    console.log('');
    
    // Test 2: Try to login with various users
    const testUsers = [
      { email: 'lokesh@company.com', password: 'employee123', name: 'Lokesh' },
      { email: 'mayank@company.com', password: 'employee123', name: 'Mayank' },
      { email: 'mohini@company.com', password: 'employee123', name: 'Mohini' },
      { email: 'aarav.sharma@company.com', password: 'employee123', name: 'Aarav' },
      { email: 'admin@company.com', password: 'admin123', name: 'Admin' },
      { email: 'manager@company.com', password: 'manager123', name: 'Manager' }
    ];
    
    console.log('2. Testing login endpoints...');
    
    for (const user of testUsers) {
      console.log(`   Testing login for ${user.name} (${user.email})`);
      
      try {
        const loginData = JSON.stringify({
          email: user.email,
          password: user.password
        });
        
        const loginResult = await makeRequest('POST', 'http://localhost:3001/api/auth/login', {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(loginData)
        }, loginData);
        
        if (loginResult.status === 200) {
          const responseData = JSON.parse(loginResult.data);
          if (responseData.token && responseData.user) {
            console.log(`      ✅ Login successful - Token received, User: ${responseData.user.name}`);
          } else {
            console.log(`      ❌ Login response missing token or user data`);
          }
        } else {
          console.log(`      ❌ Login failed with status: ${loginResult.status}`);
          console.log(`      Response: ${loginResult.data}`);
        }
      } catch (error) {
        console.log(`      ❌ Login error: ${error.message}`);
      }
    }
    
    console.log('');
    console.log('3. Summary:');
    console.log('   🌐 Server URL: http://localhost:3001');
    console.log('   📝 Test different employee emails with password: employee123');
    console.log('   📝 Manager login: manager@company.com / manager123');
    console.log('   📝 Admin login: admin@company.com / admin123');
    
  } catch (error) {
    console.error('❌ Error during web API test:', error);
  }
}

function makeRequest(method, url, headers = {}, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: headers
    };
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: responseData
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

testWebAPI();
