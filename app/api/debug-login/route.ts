import { NextResponse } from 'next/server';
import { getServerEnv } from '@/config/env';

export async function POST(request: Request) {
  const { password } = await request.json();
  const { ADMIN_PASSWORD } = getServerEnv();
  
  // Log the actual values for debugging
  console.log('=== DEBUG LOGIN ===');
  console.log('Request password:', JSON.stringify(password));
  console.log('Stored password:', JSON.stringify(ADMIN_PASSWORD));
  console.log('Password length:', ADMIN_PASSWORD?.length);
  console.log('Exact match:', password === ADMIN_PASSWORD);
  
  // Compare character by character
  if (password && ADMIN_PASSWORD) {
    console.log('Character comparison:');
    for (let i = 0; i < Math.max(password.length, ADMIN_PASSWORD.length); i++) {
      const pChar = password[i] || 'undefined';
      const aChar = ADMIN_PASSWORD[i] || 'undefined';
      console.log(`Char ${i}: '${pChar}' (${pChar.charCodeAt(0)}) vs '${aChar}' (${aChar.charCodeAt(0)})`);
    }
  }
  
  return NextResponse.json({
    success: password === ADMIN_PASSWORD,
    receivedLength: password?.length,
    storedLength: ADMIN_PASSWORD?.length,
    firstThreeChars: {
      received: password ? password.substring(0, 3) : 'undefined',
      stored: ADMIN_PASSWORD ? ADMIN_PASSWORD.substring(0, 3) : 'undefined',
    },
    charCodes: {
      received: password ? Array.from(password).map(c => c.charCodeAt(0)) : [],
      stored: ADMIN_PASSWORD ? Array.from(ADMIN_PASSWORD).map(c => c.charCodeAt(0)) : [],
    },
  });
}
