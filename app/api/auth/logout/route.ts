import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/src/lib/auth';

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );
  
  // Clear the auth cookie
  response.cookies.delete('auth-token');
  
  return response;
}
