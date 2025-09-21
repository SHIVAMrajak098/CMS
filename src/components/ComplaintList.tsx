import React, { useState, useMemo } from 'react';
import { Complaint, Status, Urgency } from '../types';
import { format } from 'date-fns';

interface ComplaintListProps {
  complaints: Complaint[];
  onUpdateStatus: (id: string, newStatus: Status) => void;
  onAssign: (id: string, adminId: string) => void;
  admins: string[];
}

const urgencyColors: Record<Urgency, string> = {
  [Urgency.High]: 'text-red-500',
  [Urgency.Medium]: 'text-yellow-500',
  [Urgency.Low]: 'text-green-500',
};

const ComplaintRow: React.FC<{ complaint: Complaint; onUpdateStatus: Function; onAssign: Function; admins: string[] }> = ({ complaint, onUpdateStatus, onAssign, admins }) => (
    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{complaint.id}</td>
        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-sm">
            <div className="truncate" title={complaint.text}>{complaint.text}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{complaint.category || 'N/A'}</td>
        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${complaint.urgency ? urgencyColors[complaint.urgency] : ''}`}>{complaint.urgency || 'N/A'}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{format(new Date(complaint.timestamp), 'MMM d, yyyy h:mm a')}</td>
        <td className="px-6 py-4 whitespace-nowrap">
            <select
                value={complaint.status}
                onChange={(e) => onUpdateStatus(complaint.id, e.target.value as Status)}
                className="text-xs p-1 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
            >
                {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
             <select
                value={complaint.assignedTo || ''}
                onChange={(e) => onAssign(complaint.id, e.target.value)}
                className="text-xs p-1 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="">Unassigned</option>
                {admins.map(admin => <option key={admin} value={admin}>{admin}</option>)}
            </select>
        </td>
    </tr>
);

const FilterSelect: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode; label: string }> = ({ value, onChange, children, label }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="mt-1 text-sm rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
        >
            {children}
        </select>
    </div>
);


export const ComplaintList: React.FC<ComplaintListProps> = ({ complaints, onUpdateStatus, onAssign, admins }) => {
    const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
    const [filterUrgency, setFilterUrgency] = useState<Urgency | 'all'>('all');
    const [filterAssigned, setFilterAssigned] = useState<string>('all');


    const filteredComplaints = useMemo(() => {
        let result = complaints;

        if (filterStatus !== 'all') {
            result = result.filter(c => c.status === filterStatus);
        }

        if (filterUrgency !== 'all') {
            result = result.filter(c => c.urgency === filterUrgency);
        }

        if (filterAssigned !== 'all') {
            if (filterAssigned === 'unassigned') {
                result = result.filter(c => !c.assignedTo);
            } else {
                result = result.filter(c => c.assignedTo === filterAssigned);
            }
        }

        return result;
    }, [complaints, filterStatus, filterUrgency, filterAssigned]);


    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold">All Complaints</h2>
                <div className="flex items-center space-x-3">
                    <FilterSelect label="Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as Status | 'all')}>
                        <option value="all">All Statuses</option>
                        {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                    </FilterSelect>
                    <FilterSelect label="Urgency" value={filterUrgency} onChange={(e) => setFilterUrgency(e.target.value as Urgency | 'all')}>
                        <option value="all">All Urgencies</option>
                        {Object.values(Urgency).map(u => <option key={u} value={u}>{u}</option>)}
                    </FilterSelect>
                    <FilterSelect label="Assigned To" value={filterAssigned} onChange={(e) => setFilterAssigned(e.target.value)}>
                        <option value="all">All Admins</option>
                        <option value="unassigned">Unassigned</option>
                        {admins.map(admin => <option key={admin} value={admin}>{admin}</option>)}
                    </FilterSelect>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            {['ID', 'Complaint', 'Category', 'Urgency', 'Date', 'Status', 'Assigned To'].map(header => (
                                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                       {filteredComplaints.length > 0 ? filteredComplaints.map(complaint => (
                           <ComplaintRow key={complaint.id} complaint={complaint} onUpdateStatus={onUpdateStatus} onAssign={onAssign} admins={admins} />
                       )) : (
                           <tr>
                               <td colSpan={7} className="text-center py-8 text-gray-500">No complaints match the current filter.</td>
                           </tr>
                       )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
