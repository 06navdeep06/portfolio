import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Ping received at:', new Date().toISOString());
  return NextResponse.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    message: 'Server is running and responding to requests'
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  console.log('Ping POST received at:', new Date().toISOString());
  console.log('Request body:', body);
  
  return NextResponse.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    method: 'POST',
    body: body || 'No body provided',
    headers: Object.fromEntries(request.headers.entries())
  });
}
