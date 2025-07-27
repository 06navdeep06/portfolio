import { getServerEnv } from '@/config/env';

/**
 * Logs environment variables for debugging purposes
 * Only runs on the server side
 */
export function logEnvironment() {
  if (typeof window !== 'undefined') return; // Only run on server

  const env = getServerEnv();
  
  console.log('\n=== Environment Variables ===');
  console.log(`NODE_ENV: ${env.NODE_ENV}`);
  console.log(`ADMIN_PASSWORD set: ${!!env.ADMIN_PASSWORD}`);
  console.log(`ADMIN_PASSWORD length: ${env.ADMIN_PASSWORD.length}`);
  console.log('===========================\n');
}

// Run the logger when this module is imported
logEnvironment();
