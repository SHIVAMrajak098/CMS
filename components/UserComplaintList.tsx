import React from 'react';
import { Complaint, Status, Urgency } from '../types';
import { format } from 'date-fns';

interface UserComplaintListProps {
  complaints: Complaint[];
}

const statusColors: Record<Status, string> = {
    [Status.Submitted]: 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100',
    [Status.Classified]: 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    [Status.Assigned]: 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    [Status.InProgress]: 'bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    [Status.Resolved]: 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200',
    [Status.Closed]: 'bg-gray-500 text-white dark:bg-gray-700 dark:text-gray-200',
};

const urgencyColors: Record<Urgency, string> = {
    [Urgency.High]: 'text-red-500 dark:text-red-400',
    [Urgency.Medium]: 'text-yellow-500 dark:text-yellow-400',
    [Urgency.Low]: 'text-green-500 dark:text-green-400',
};

export const UserComplaintList: React.FC<UserComplaintListProps> = ({ complaints }) => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            {['ID', 'Complaint Details', 'Category', 'Urgency', 'Date', 'Status'].map(header => (
                                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                       {complaints.map(complaint => (
                           <tr key={complaint.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{complaint.id}</td>
                               <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-md">
                                 <div className="truncate" title={complaint.text}>{complaint.text}</div>
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{complaint.category || 'N/A'}</td>
                               <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${complaint.urgency ? urgencyColors[complaint.urgency] : ''}`}>{complaint.urgency || 'Pending AI'}</td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{format(new Date(complaint.timestamp), 'MMM d, yyyy')}</td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm">
                                   <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[complaint.status]}`}>
                                       {complaint.status}
                                   </span>
                               </td>
                           </tr>
                       ))}
                    </tbody>
                </table>
                {complaints.length === 0 && <p className="text-center py-8 text-gray-500 dark:text-gray-400">You have not submitted any complaints yet. Click "New Complaint" to start.</p>}
            </div>
        </div>
    );
};