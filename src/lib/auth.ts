import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_NAME = 'auth-token';

export interface TokenPayload {
  userId: string;
  role: string;
  exp: number;
}

export function generateToken(userId: string, role = 'admin'): string {
  return jwt.sign(
    { 
      userId, 
      role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
    },
    JWT_SECRET
  );
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function getTokenFromCookies(): string | null {
  const cookieStore = cookies();
  return cookieStore.get(TOKEN_NAME)?.value || null;
}

export function setAuthCookies(token: string) {
  const cookieStore = cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearAuthCookies() {
  const cookieStore = cookies();
  cookieStore.delete(TOKEN_NAME);
}

export function isAuthenticated(): boolean {
  const token = getTokenFromCookies();
  if (!token) return false;
  
  const payload = verifyToken(token);
  return !!payload && payload.exp > Math.floor(Date.now() / 1000);
}

export function getCurrentUser(): TokenPayload | null {
  const token = getTokenFromCookies();
  if (!token) return null;
  
  const payload = verifyToken(token);
  if (!payload || payload.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }
  
  return payload;
}
