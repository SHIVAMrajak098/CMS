import React from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface DebugEnvProps {
    error: Error;
}

const envVars = [
    { name: 'VITE_API_KEY', value: import.meta.env.VITE_API_KEY },
    { name: 'VITE_FIREBASE_API_KEY', value: import.meta.env.VITE_FIREBASE_API_KEY },
    { name: 'VITE_FIREBASE_AUTH_DOMAIN', value: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN },
    { name: 'VITE_FIREBASE_PROJECT_ID', value: import.meta.env.VITE_FIREBASE_PROJECT_ID },
    { name: 'VITE_FIREBASE_STORAGE_BUCKET', value: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET },
    { name: 'VITE_FIREBASE_MESSAGING_SENDER_ID', value: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID },
    { name: 'VITE_FIREBASE_APP_ID', value: import.meta.env.VITE_FIREBASE_APP_ID },
];

const DebugEnv: React.FC<DebugEnvProps> = ({ error }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-2xl p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
                <div className="text-center">
                    <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
                    <h2 className="mt-4 text-2xl font-extrabold text-gray-900 dark:text-white">Application Configuration Error</h2>
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-3 rounded-md">
                        <strong>Error:</strong> {error.message}
                    </p>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Environment Variable Status</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">This shows the values your application is currently seeing. They should not be 'MISSING'.</p>
                    <div className="space-y-2">
                        {envVars.map(env => (
                            <div key={env.name} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                                <code className="text-sm font-mono text-gray-700 dark:text-gray-300">{env.name}</code>
                                {env.value ? (
                                    <span className="flex items-center text-xs font-semibold text-green-600 dark:text-green-400">
                                        <CheckCircleIcon className="h-4 w-4 mr-1"/> LOADED
                                    </span>
                                ) : (
                                    <span className="flex items-center text-xs font-semibold text-red-500 dark:text-red-400">
                                        <XCircleIcon className="h-4 w-4 mr-1"/> MISSING
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                     <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Troubleshooting Checklist</h3>
                     <ul className="mt-3 list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li>Is there a file named <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">.env</code> in the project's root directory (the same folder as <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">package.json</code>)?</li>
                        <li>Does the <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">.env</code> file contain all the variables listed above?</li>
                        <li>Are all variable names spelled correctly and prefixed with <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">VITE_</code>?</li>
                        <li>
                            <strong>Most Important:</strong> Did you <strong className="text-indigo-500">stop and restart</strong> the development server (e.g., <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">npm run dev</code>) after creating or changing the <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">.env</code> file? Changes are not applied automatically.
                        </li>
                     </ul>
                </div>
            </div>
        </div>
    );
};

export default DebugEnv;
