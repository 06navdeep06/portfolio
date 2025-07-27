/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  
  // Configure webpack to handle specific file types if needed
  webpack: (config) => {
    return config;
  },
  
  // Environment variables that should be available to the client
  env: {
    // Add any client-side environment variables here
    // They will be prefixed with NEXT_PUBLIC_
    // For server-side environment variables, use process.env in API routes
  },
  
  // Ensure environment variables are loaded at build time
  publicRuntimeConfig: {
    // Will be available on both server and client
    // Access via getConfig().publicRuntimeConfig.ADMIN_PASSWORD
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    // Access via getConfig().serverRuntimeConfig.ADMIN_PASSWORD
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  },
  
  // Enable source maps in development
  productionBrowserSourceMaps: false,
  
  // Configure images if needed
  images: {
    domains: [],
  },
  
  // Enable TypeScript type checking in development
  typescript: {
    // Enable type checking in production builds
    ignoreBuildErrors: false,
  },
  
  // Enable ESLint in development
  eslint: {
    // Run ESLint during production builds
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
