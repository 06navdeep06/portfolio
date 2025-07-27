import { NextResponse } from 'next/server';

export async function GET() {
  // This will show the actual value in the logs (be careful with sensitive data)
  console.log('ADMIN_PASSWORD from process.env:', process.env.ADMIN_PASSWORD);
  
  return NextResponse.json({
    env: {
      NODE_ENV: process.env.NODE_ENV,
      ADMIN_PASSWORD_SET: !!process.env.ADMIN_PASSWORD,
      ADMIN_PASSWORD_LENGTH: process.env.ADMIN_PASSWORD?.length || 0,
      // Show first and last character of the password for verification (be careful with this in production)
      ADMIN_PASSWORD_STARTS_WITH: process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD[0] : null,
      ADMIN_PASSWORD_ENDS_WITH: process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD[process.env.ADMIN_PASSWORD.length - 1] : null,
    },
    // Show the raw password in the response (for debugging only - remove in production)
    raw: {
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
    }
  });
}
