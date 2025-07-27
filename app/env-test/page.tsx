'use client';

import { useEffect, useState } from 'react';

export default function EnvTestPage() {
  const [env, setEnv] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnv = async () => {
      try {
        const response = await fetch('/api/check-env');
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
        <h1 className="text-2xl font-bold mb-6">Environment Variables Test</h1>
        
        {error ? (
          <div className="p-4 mb-6 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        ) : null}

        {env ? (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-md">
              <h2 className="text-xl font-semibold mb-3">Environment Variables:</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(env, null, 2)}
              </pre>
            </div>

            <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
              <h2 className="text-xl font-semibold mb-3">Raw Environment Variables:</h2>
              <div className="bg-white p-4 rounded border">
                <p className="font-mono break-all">ADMIN_PASSWORD: {env.raw?.ADMIN_PASSWORD || 'NOT FOUND'}</p>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Note: In a production environment, never expose sensitive environment variables to the client.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading environment variables...</p>
          </div>
        )}

        <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold mb-2">Next Steps</h2>
          <p className="mb-4">If the ADMIN_PASSWORD is not showing up correctly, please check the following:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Make sure the <code className="bg-gray-100 px-1 rounded">.env</code> file exists in your project root</li>
            <li>Verify the <code className="bg-gray-100 px-1 rounded">ADMIN_PASSWORD</code> is set in the <code className="bg-gray-100 px-1 rounded">.env</code> file</li>
            <li>Restart your development server after making changes to <code className="bg-gray-100 px-1 rounded">.env</code></li>
            <li>Check the server logs for any errors during startup</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
