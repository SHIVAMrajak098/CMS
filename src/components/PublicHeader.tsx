import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/solid';

export const PublicHeader: React.FC = () => {
    return (
        <header className="flex items-center justify-between h-20 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
             <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-indigo-500" />
                <h1 className="ml-3 text-2xl font-semibold text-gray-800 dark:text-white">Public Complaint Analytics</h1>
             </div>
             <a href="/" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                Go to Login
             </a>
        </header>
    );
};