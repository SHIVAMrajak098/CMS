import React from 'react';
import { Notification } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { XMarkIcon, BellAlertIcon } from '@heroicons/react/24/outline';

interface NotificationPanelProps {
    notifications: Notification[];
    onClose: () => void;
    onMarkAsRead: (id: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClose, onMarkAsRead }) => {
    
    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            onMarkAsRead(notification.id);
        }
        // Future enhancement: could also navigate to the complaint details
    };
    
    return (
        <div className="absolute top-20 right-6 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border dark:border-gray-700 z-50">
            <div className="flex justify-between items-center p-3 border-b dark:border-gray-700">
                <h4 className="font-semibold text-gray-800 dark:text-white">Notifications</h4>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-3 border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${!n.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                        >
                            <div className="flex items-start">
                                {!n.read && <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>}
                                <div className={`flex-grow ${n.read ? 'ml-5' : ''}`}>
                                    <p className="text-sm text-gray-700 dark:text-gray-200">{n.message}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                        <BellAlertIcon className="h-10 w-10 mx-auto mb-2"/>
                        <p className="text-sm">No notifications yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
