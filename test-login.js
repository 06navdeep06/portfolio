// Simple script to test the login functionality
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = 3000;
const HOST = 'localhost';
const PROTOCOL = 'http';
const TEST_PASSWORD = '$06Navdeep06';

// Read the .env file
const envPath = path.join(__dirname, '.env');
let envContent = '';
let envPassword = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  // Simple parsing of .env file
  const match = envContent.match(/ADMIN_PASSWORD=['"]?([^\r\n]*)['"]?/);
  if (match && match[1]) {
    envPassword = match[1];
  }
}

console.log('=== Login Test ===');
console.log(`Testing against: ${PROTOCOL}://${HOST}:${PORT}`);
console.log('Environment file exists:', fs.existsSync(envPath));
console.log('ADMIN_PASSWORD from .env:', envPassword ? '***' + envPassword.slice(-3) : 'NOT FOUND');
console.log('Test password:', '***' + TEST_PASSWORD.slice(-3));

// Make a test login request
const postData = JSON.stringify({
  password: TEST_PASSWORD
});

const options = {
  hostname: HOST,
  port: PORT,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('\nSending login request...');

const req = http.request(options, (res) => {
  console.log(`\nResponse Status: ${res.statusCode} ${res.statusMessage}`);
  console.log('Response Headers:', res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Response Body:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Response Body (raw):', data);
    }
    
    // Check for auth cookie
    const setCookie = res.headers['set-cookie'];
    if (setCookie) {
      console.log('\nCookies set:', setCookie);
    } else {
      console.log('\nNo cookies set in response');
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
