import { NextResponse } from 'next/server';
import { getServerEnv } from '@/config/env';
import { generateToken, setAuthCookies } from '@/src/lib/auth';
import { logEnvironment } from '@/utils/env-logger';
import bcrypt from 'bcryptjs';

// Log environment variables at startup
logEnvironment();

// Get environment variables
const { ADMIN_PASSWORD: HASHED_ADMIN_PASSWORD } = getServerEnv();

// Log the environment for debugging
console.log('\n=== Login Route Initialized ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ADMIN_PASSWORD set:', !!process.env.ADMIN_PASSWORD);
console.log('==============================\n');

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }
    
    // In a real app, you would verify the password against a hashed version
    // For this example, we'll use a simple comparison
    const isPasswordValid = await bcrypt.compare(password, HASHED_ADMIN_PASSWORD);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = generateToken('admin');
    
    // Set the auth cookie
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );
    
    // Set the auth cookie in the response
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    return response;
      receivedPassword: password
    });

    if (password === CORRECT_PASSWORD) {
      // Set the auth cookie
      cookies().set({
        name: AUTH_COOKIE_NAME,
        value: AUTH_COOKIE_VALUE,
        ...AUTH_COOKIE_OPTIONS,
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
