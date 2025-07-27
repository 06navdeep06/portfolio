import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/src/lib/auth';

export async function GET() {
  try {
    // Use the isAuthenticated function to check authentication status
    const authenticated = isAuthenticated();
    
    return NextResponse.json({ authenticated });
  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json(
      { error: 'Failed to check authentication status' },
      { status: 500 }
    );
  }
}
