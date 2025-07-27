'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [env, setEnv] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnv = async () => {
      try {
        const response = await fetch('/api/test-env');
        const data = await response.json();
        setEnv(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      }
    };

    fetchEnv();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Environment Variables Test</h1>
        
        {error ? (
          <div className="p-4 mb-6 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        ) : null}

        {env ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <h2 className="text-xl font-semibold mb-2">Environment Variables:</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                {JSON.stringify(env, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading environment variables...</p>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-2">Login Test</h2>
          <p className="mb-4">Try logging in with the password you set in .env file.</p>
          <a 
            href="/login" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go to Login Page
          </a>
        </div>
      </div>
    </div>
  );
}
