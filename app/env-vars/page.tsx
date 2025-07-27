'use client';

import { useEffect, useState } from 'react';

export default function EnvVarsPage() {
  const [envData, setEnvData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnvData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/debug-env');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEnvData(data);
      } catch (err) {
        console.error('Error fetching environment data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnvData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading environment variables...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Environment Variables</h1>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p className="font-bold">Error:</p>
            <p className="whitespace-pre-wrap break-words">{error}</p>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <h3 className="font-bold text-yellow-800 mb-2">Troubleshooting Steps:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Make sure your <code className="bg-gray-100 px-1 rounded">.env</code> file exists in the project root</li>
              <li>Check that the server is running in development mode</li>
              <li>Look for errors in the browser console and server logs</li>
              <li>Restart the development server after making changes to <code className="bg-gray-100 px-1 rounded">.env</code></li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Environment Variables</h1>
        
        {envData && (
          <div className="space-y-8">
            {/* System Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">System Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Node Version</p>
                  <p className="font-mono">{envData.system?.nodeVersion || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Platform</p>
                  <p className="font-mono">{envData.system?.platform || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Directory</p>
                  <p className="font-mono text-sm break-all">{envData.system?.cwd || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">.env File</p>
                  <p className="font-mono text-sm">
                    {envData.system?.envFileExists ? 'Found' : 'Not Found'}
                    {envData.system?.envFilePath && ` at ${envData.system.envFilePath}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Environment Variables */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Environment Variables</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variable</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(envData.environment || {}).map(([key, value]) => (
                      <tr key={key}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Authentication Status */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Authentication Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ADMIN_PASSWORD Set</p>
                  <p className={`font-mono ${envData.auth?.ADMIN_PASSWORD_SET ? 'text-green-600' : 'text-red-600'}`}>
                    {envData.auth?.ADMIN_PASSWORD_SET ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ADMIN_PASSWORD Length</p>
                  <p className="font-mono">{envData.auth?.ADMIN_PASSWORD_LENGTH || '0'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Starts With</p>
                  <p className="font-mono">{envData.auth?.ADMIN_PASSWORD_STARTS_WITH || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ends With</p>
                  <p className="font-mono">{envData.auth?.ADMIN_PASSWORD_ENDS_WITH || 'N/A'}</p>
                </div>
              </div>
              
              {process.env.NODE_ENV === 'development' && envData.raw?.ADMIN_PASSWORD && (
                <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                  <p className="text-sm text-yellow-700">
                    <span className="font-bold">Warning:</span> This is a development build. In production, sensitive values would not be exposed.
                  </p>
                  <div className="mt-2 p-2 bg-white rounded border">
                    <p className="text-xs text-gray-500 mb-1">ADMIN_PASSWORD (for debugging only):</p>
                    <p className="font-mono text-sm break-all">{envData.raw.ADMIN_PASSWORD}</p>
                  </div>
                </div>
              )}
            </div>

            {/* .env File Content */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">.env File Content</h2>
              {envData.envFile ? (
                <div className="bg-gray-50 p-4 rounded border">
                  <pre className="whitespace-pre-wrap break-words text-sm font-mono">
                    {envData.envFile}
                  </pre>
                </div>
              ) : (
                <p className="text-gray-500 italic">No .env file found or content could not be read.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
