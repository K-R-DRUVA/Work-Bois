const fs = require('fs');
const path = require('path');

const relativePath = '../../../Task1';

const fullPath = path.resolve(relativePath);

if (fs.existsSync(fullPath)) {
  console.log(`✅ Path exists: ${fullPath}`);
} else {
  console.error(`❌ Path does NOT exist: ${fullPath}`);
}
