import { NextResponse } from 'next/server';
import { getServerEnv } from '@/config/env';

export async function GET() {
  const env = getServerEnv();
  
  return NextResponse.json({
    processEnv: {
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? '***SET***' : '***NOT SET***',
      ADMIN_PASSWORD_LENGTH: process.env.ADMIN_PASSWORD?.length || 0,
      NODE_ENV: process.env.NODE_ENV,
    },
    serverEnv: {
      ADMIN_PASSWORD: env.ADMIN_PASSWORD ? '***SET***' : '***NOT SET***',
      ADMIN_PASSWORD_LENGTH: env.ADMIN_PASSWORD?.length || 0,
      NODE_ENV: env.NODE_ENV,
    },
    raw: {
      processEnv: JSON.stringify(process.env.ADMIN_PASSWORD),
      serverEnv: JSON.stringify(env.ADMIN_PASSWORD),
    },
  });
}