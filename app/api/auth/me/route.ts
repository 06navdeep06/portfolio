import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/lib/auth';

export async function GET() {
  const user = getCurrentUser();
  
  if (!user) {
    return NextResponse.json(
      { isAuthenticated: false },
      { status: 401 }
    );
  }
  
  return NextResponse.json({
    isAuthenticated: true,
    user: {
      id: user.userId,
      role: user.role
    }
  });
}
