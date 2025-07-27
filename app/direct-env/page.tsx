// This is a server component that will show environment variables directly
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

// Disable caching for this page
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Direct Environment Variables',
  description: 'Direct view of environment variables',
};

// Function to safely read the .env file
function readEnvFile() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      return fs.readFileSync(envPath, 'utf-8');
    }
    return '.env file not found';
  } catch (error) {
    return `Error reading .env file: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

export default function DirectEnvPage() {
  // Read environment variables
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_PASSWORD_LENGTH: process.env.ADMIN_PASSWORD?.length || 0,
    // Add more environment variables as needed
  };

  // Read the .env file
  const envFileContent = readEnvFile();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Direct Environment Variables</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Environment Variables</h2>
          <div className="bg-gray-50 p-4 rounded border">
            <pre className="whitespace-pre-wrap break-words text-sm">
              {JSON.stringify(envVars, null, 2)}
            </pre>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Process Environment</h2>
          <div className="bg-gray-50 p-4 rounded border max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap break-words text-xs">
              {JSON.stringify(process.env, null, 2)}
            </pre>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">.env File Content</h2>
          <div className="bg-gray-50 p-4 rounded border">
            <pre className="whitespace-pre-wrap break-words text-sm">
              {envFileContent}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
