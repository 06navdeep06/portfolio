import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// This is a simple endpoint to log environment variables to the console
export async function GET() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    const envExists = fs.existsSync(envPath);
    
    console.log('\n=== Environment Variables ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('ADMIN_PASSWORD set:', !!process.env.ADMIN_PASSWORD);
    console.log('ADMIN_PASSWORD length:', process.env.ADMIN_PASSWORD?.length || 0);
    console.log('ADMIN_PASSWORD value (first 3 chars):', 
      process.env.ADMIN_PASSWORD ? 
      process.env.ADMIN_PASSWORD.substring(0, 3) + '...' : 
      'NOT SET'
    );
    
    console.log('\n=== .env File Info ===');
    console.log('.env file exists:', envExists);
    if (envExists) {
      try {
        const content = fs.readFileSync(envPath, 'utf-8');
        console.log('.env file content:');
        console.log(content);
      } catch (err) {
        console.error('Error reading .env file:', err);
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Check server console for environment variable details',
      env: {
        NODE_ENV: process.env.NODE_ENV,
        ADMIN_PASSWORD_SET: !!process.env.ADMIN_PASSWORD,
        ADMIN_PASSWORD_LENGTH: process.env.ADMIN_PASSWORD?.length || 0,
      }
    });
  } catch (error) {
    console.error('Error in log-env endpoint:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
