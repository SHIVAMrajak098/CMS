import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { differenceInHours } from 'date-fns';
import { Complaint, Status, Department } from '../types';
import { subscribeToComplaints } from '../services/complaintService';
import { PublicHeader } from './PublicHeader';
import { ExclamationTriangleIcon, ChartPieIcon, DocumentCheckIcon, ClockIcon } from '@heroicons/react/24/outline';


const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            <Icon className="h-8 w-8 text-white" />
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#A569BD'];

const calculateAverageResolutionTime = (complaints: Complaint[]): string => {
    const resolvedComplaints = complaints.filter(
        c => c.status === Status.Resolved || c.status === Status.Closed
    );

    if (resolvedComplaints.length === 0) {
        return 'N/A';
    }

    let totalHours = 0;
    let resolvedCount = 0;

    resolvedComplaints.forEach(complaint => {
        const submittedLog = complaint.auditLog.find(log => log.action === 'Submitted');
        const resolvedLog = complaint.auditLog.slice().reverse().find(log => log.action.includes('Resolved') || log.action.includes('Closed'));
        
        if (submittedLog && resolvedLog) {
            const startTime = new Date(submittedLog.timestamp);
            const endTime = new Date(resolvedLog.timestamp);
            const hours = differenceInHours(endTime, startTime);
            if (hours >= 0) {
                totalHours += hours;
                resolvedCount++;
            }
        }
    });
    
    if (resolvedCount === 0) {
        return 'N/A';
    }

    const avgHours = totalHours / resolvedCount;
    if (avgHours < 24) {
        return `${avgHours.toFixed(1)} hours`;
    } else {
        const avgDays = avgHours / 24;
        return `${avgDays.toFixed(1)} days`;
    }
};


export default function PublicDashboard() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToComplaints(
            (newComplaints) => {
                setComplaints(newComplaints);
                setLoading(false);
            },
            (err) => {
                console.error(err);
                setError("Could not load public complaint data. The service may be temporarily unavailable.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const stats = useMemo(() => {
        const resolvedCount = complaints.filter(c => c.status === Status.Resolved || c.status === Status.Closed).length;
        return {
            total: complaints.length,
            resolved: resolvedCount,
            open: complaints.length - resolvedCount,
            avgResolutionTime: calculateAverageResolutionTime(complaints),
        };
    }, [complaints]);

    const departmentData = useMemo(() => {
        const counts = complaints.reduce((acc, c) => {
            if (c.department) {
                acc[c.department] = (acc[c.department] || 0) + 1;
            }
            return acc;
        }, {} as Record<Department, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
    }, [complaints]);
    
    const statusData = useMemo(() => {
        const counts = complaints.reduce((acc, c) => {
            acc[c.status] = (acc[c.status] || 0) + 1;
            return acc;
        }, {} as Record<Status, number>);
        return Object.values(Status).map(status => ({ name: status, value: counts[status] || 0 }));
    }, [complaints]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
                <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    if (error) {
        return (
             <div className="flex flex-col items-center justify-center h-screen bg-red-50 dark:bg-gray-900 text-center p-4">
                <div className="max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500" />
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">An Error Occurred</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <PublicHeader />
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Complaints" value={stats.total} icon={ChartPieIcon} color="bg-blue-500" />
                    <StatCard title="Complaints Resolved" value={stats.resolved} icon={DocumentCheckIcon} color="bg-green-500" />
                    <StatCard title="Avg. Resolution Time" value={stats.avgResolutionTime} icon={ClockIcon} color="bg-yellow-500" />
                    <StatCard title="Open Complaints" value={stats.open} icon={ExclamationTriangleIcon} color="bg-red-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="font-bold text-lg mb-4">Complaints by Department</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={departmentData} cx="50%" cy="50%" labelLine={false} outerRadius={110} fill="#8884d8" dataKey="value" nameKey="name">
                                    {departmentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip wrapperClassName="dark:!bg-gray-900 !border-gray-700" contentStyle={{backgroundColor: 'transparent'}}/>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="font-bold text-lg mb-4">Complaints by Status</h3>
                         <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={statusData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip wrapperClassName="dark:!bg-gray-900 !border-gray-700" contentStyle={{backgroundColor: 'transparent'}} />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="font-bold text-lg mb-4">Complaint Hotspots</h3>
                    <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                        <p className="text-gray-500">A live heatmap of complaint locations would be displayed here.</p>
                    </div>
                </div>

                <footer className="text-center py-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        This data is provided for informational purposes only and is updated in real-time.
                    </p>
                </footer>
            </main>
        </div>
    );
}