import { NextResponse } from 'next/server';

// This is a debug endpoint to check environment variables
// WARNING: This exposes sensitive information and should be removed in production

export async function GET() {
  try {
    // Get all environment variables
    const envVars = process.env;
    
    // Log important environment variables (be careful with sensitive data)
    console.log('=== Debug Environment Variables ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('ADMIN_PASSWORD set:', !!process.env.ADMIN_PASSWORD);
    console.log('ADMIN_PASSWORD length:', process.env.ADMIN_PASSWORD?.length || 0);
    
    // Get the current working directory and .env file location
    const path = await import('path');
    const fs = await import('fs');
    
    const cwd = process.cwd();
    const envPath = path.join(cwd, '.env');
    const envExists = fs.existsSync(envPath);
    
    // Read .env file if it exists
    let envFileContent = '';
    if (envExists) {
      try {
        envFileContent = fs.readFileSync(envPath, 'utf-8');
      } catch (error) {
        console.error('Error reading .env file:', error);
      }
    }
    
    // Return the response
    return NextResponse.json({
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        cwd: cwd,
        envFileExists: envExists,
        envFilePath: envPath,
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        // Only include non-sensitive environment variables
        ...Object.fromEntries(
          Object.entries(process.env)
            .filter(([key]) => !key.includes('SECRET') && !key.includes('PASSWORD') && !key.includes('KEY'))
        ),
      },
      auth: {
        ADMIN_PASSWORD_SET: !!process.env.ADMIN_PASSWORD,
        ADMIN_PASSWORD_LENGTH: process.env.ADMIN_PASSWORD?.length || 0,
        // Only show first and last character for verification
        ADMIN_PASSWORD_STARTS_WITH: process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD[0] : null,
        ADMIN_PASSWORD_ENDS_WITH: process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD[process.env.ADMIN_PASSWORD.length - 1] : null,
      },
      envFile: envExists ? envFileContent : '.env file not found',
      // Only include raw password in development
      ...(process.env.NODE_ENV === 'development' ? {
        raw: {
          ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
        }
      } : {})
    });
  } catch (error) {
    console.error('Error in debug-env endpoint:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
