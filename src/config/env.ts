// This file centralizes the management of environment variables

// Server-side environment variables
export const getServerEnv = () => {
  // In a real application, you might want to validate these values
  return {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
};

// Client-side environment variables (prefixed with NEXT_PUBLIC_)
export const getClientEnv = () => {
  return {
    // Add any client-side environment variables here
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
};

// Log environment variables for debugging (server-side only)
if (typeof window === 'undefined') {
  const serverEnv = getServerEnv();
  console.log('=== Server Environment ===');
  console.log('NODE_ENV:', serverEnv.NODE_ENV);
  console.log('ADMIN_PASSWORD set:', !!serverEnv.ADMIN_PASSWORD);
  console.log('ADMIN_PASSWORD length:', serverEnv.ADMIN_PASSWORD.length);
  console.log('ADMIN_PASSWORD value (first 3 chars):', 
    serverEnv.ADMIN_PASSWORD ? 
    serverEnv.ADMIN_PASSWORD.substring(0, 3) + '...' : 
    'NOT SET'
  );
}
