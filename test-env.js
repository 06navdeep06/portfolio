require('dotenv').config();

console.log('=== Environment Variables Test ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? '***SET***' : 'NOT SET');
console.log('ADMIN_PASSWORD length:', process.env.ADMIN_PASSWORD?.length || 0);
console.log('ADMIN_PASSWORD starts with:', process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.substring(0, 3) + '...' : 'N/A');
console.log('Current directory:', process.cwd());
