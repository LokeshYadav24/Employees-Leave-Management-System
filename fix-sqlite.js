const fs = require('fs');
const path = require('path');

// File paths to update
const filesToUpdate = [
  'routes/leaves.js',
  'routes/users.js'
];

// MySQL to SQLite function mappings
const replacements = [
  // MySQL functions to SQLite equivalents
  { from: /YEAR\(CURDATE\(\)\)/g, to: "strftime('%Y', 'now')" },
  { from: /CURDATE\(\)/g, to: "date('now')" },
  { from: /YEAR\(([^)]+)\)/g, to: "strftime('%Y', $1)" },
  { from: /MONTH\(([^)]+)\)/g, to: "strftime('%m', $1)" },
  { from: /CONCAT\(([^,]+),\s*'([^']*)',\s*([^)]+)\)/g, to: "($1 || '$2' || $3)" },
  { from: /CONCAT\(([^)]+)\)/g, to: "($1)" },
  { from: /DATE_ADD\(CURDATE\(\),\s*INTERVAL\s*(\d+)\s*DAY\)/g, to: "date('now', '+$1 days')" },
  
  // Database query method changes
  { from: /const \[([^\]]+)\] = await pool\.execute\(/g, to: "const $1 = await pool.all(" },
  { from: /await pool\.execute\(/g, to: "await pool.run(" },
  
  // Boolean values
  { from: /= TRUE/g, to: "= 1" },
  { from: /= FALSE/g, to: "= 0" },
  { from: /is_active = TRUE/g, to: "is_active = 1" },
  { from: /is_active = FALSE/g, to: "is_active = 0" }
];

function updateFile(filePath) {
  console.log(`📝 Updating ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Apply all replacements
  replacements.forEach((replacement, index) => {
    content = content.replace(replacement.from, replacement.to);
  });
  
  // Custom fixes for specific patterns
  
  // Fix CONCAT with || operator for SQLite
  content = content.replace(/CONCAT\(u\.first_name,\s*'\s*',\s*u\.last_name\)/g, "(u.first_name || ' ' || u.last_name)");
  
  // Fix array destructuring issues for SQLite results
  content = content.replace(/if \(([a-zA-Z]+)\.length === 0\)/g, "if (!$1 || $1.length === 0)");
  content = content.replace(/([a-zA-Z]+)\[0\]\?\.([a-zA-Z_]+)/g, "$1?.$2");
  
  // Special handling for insert operations
  content = content.replace(/result\.insertId/g, "result.insertId");
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed in ${filePath}`);
  }
}

console.log('🔧 Fixing SQLite compatibility issues...\n');

filesToUpdate.forEach(updateFile);

console.log('\n🎉 All files updated for SQLite compatibility!');
console.log('\n📋 Summary of changes made:');
console.log('- Replaced MySQL date functions with SQLite equivalents');
console.log('- Updated CONCAT syntax to use SQLite string concatenation (||)');
console.log('- Changed pool.execute to pool.all/pool.run for appropriate queries');
console.log('- Updated boolean TRUE/FALSE to 1/0');
console.log('- Fixed array destructuring for SQLite results');
