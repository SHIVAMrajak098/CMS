import React from 'react';
import { DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

interface BlockedProps {
    onLogout: () => void;
}

const Blocked: React.FC<BlockedProps> = ({ onLogout }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center p-4">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
                <DevicePhoneMobileIcon className="mx-auto h-16 w-16 text-indigo-500" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Mobile Experience Recommended</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    To submit and track complaints, please access this portal from a mobile device for the best experience. The administrative panel is available on desktop.
                </p>
                <button
                    onClick={onLogout}
                    className="mt-6 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Blocked;
