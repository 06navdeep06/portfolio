const fs = require('fs');
const path = require('path');

// Read the .env file directly
const envPath = path.join(__dirname, '.env');
console.log('Reading .env from:', envPath);

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('=== .env file content ===');
  console.log(envContent);
  console.log('=========================');
  
  // Parse the .env file manually
  const envVars = envContent
    .split('\n')
    .filter(line => line.trim() !== '' && !line.trim().startsWith('#'))
    .reduce((acc, line) => {
      const [key, ...value] = line.split('=');
      acc[key.trim()] = value.join('=').trim();
      return acc;
    }, {});
    
  console.log('Parsed environment variables:');
  console.log(JSON.stringify(envVars, null, 2));
  
  // Check the ADMIN_PASSWORD
  console.log('\nADMIN_PASSWORD value:', envVars['ADMIN_PASSWORD']);
  console.log('ADMIN_PASSWORD length:', envVars['ADMIN_PASSWORD']?.length || 0);
  console.log('ADMIN_PASSWORD starts with:', envVars['ADMIN_PASSWORD'] ? envVars['ADMIN_PASSWORD'].substring(0, 3) + '...' : 'N/A');
} else {
  console.error('Error: .env file not found at', envPath);
}
