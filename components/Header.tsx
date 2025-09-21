
import React from 'react';
import { User } from '../types';
import { BellIcon, ArrowRightOnRectangleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
    user: User;
    onLogout: () => void;
    onNewComplaint: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onNewComplaint }) => {
    return (
        <header className="flex items-center justify-between h-20 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
             <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
                <button 
                    onClick={onNewComplaint}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    New Complaint
                </button>
                <button className="p-2 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                    <BellIcon className="h-6 w-6" />
                </button>
                <div className="flex items-center">
                    <div className="mr-3 text-right">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">{user.email}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role.toLowerCase()}</p>
                    </div>
                     <button
                        onClick={onLogout}
                        className="p-2 text-gray-500 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                        aria-label="Logout"
                     >
                         <ArrowRightOnRectangleIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>
    );
};
