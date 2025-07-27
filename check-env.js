// Simple script to check if environment variables are being loaded correctly
require('dotenv').config();

console.log('=== Environment Variables ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ADMIN_PASSWORD set:', !!process.env.ADMIN_PASSWORD);
console.log('ADMIN_PASSWORD length:', process.env.ADMIN_PASSWORD?.length || 0);
console.log('ADMIN_PASSWORD value (first 3 chars):', 
  process.env.ADMIN_PASSWORD ? 
  process.env.ADMIN_PASSWORD.substring(0, 3) + '...' : 
  'NOT SET'
);

// Test the environment configuration
console.log('\n=== Testing Environment Configuration ===');
try {
  // Use require for CommonJS modules
  const { getServerEnv } = require('./dist/config/env');
  const env = getServerEnv();
  console.log('Server Environment:');
  console.log('NODE_ENV:', env.NODE_ENV);
  console.log('ADMIN_PASSWORD length:', env.ADMIN_PASSWORD?.length || 0);
  console.log('ADMIN_PASSWORD value (first 3 chars):', 
    env.ADMIN_PASSWORD ? 
    env.ADMIN_PASSWORD.substring(0, 3) + '...' : 
    'NOT SET'
  );
} catch (error) {
  console.error('Error loading environment configuration:');
  console.error(error);
  console.log('\nNote: If you see a module not found error, try running `npm run build` first.');
}
