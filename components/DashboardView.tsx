

import React, { useMemo } from 'react';
import { Complaint, Status, Urgency, Category } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartPieIcon, DocumentCheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const StatCard: React.FC<{ title: string; value: number; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const DashboardView: React.FC<{ complaints: Complaint[] }> = ({ complaints }) => {
    const stats = useMemo(() => {
        return {
            total: complaints.length,
            open: complaints.filter(c => c.status !== Status.Resolved && c.status !== Status.Closed).length,
            highUrgency: complaints.filter(c => c.urgency === Urgency.High).length,
        };
    }, [complaints]);

    const categoryData = useMemo(() => {
        const counts = complaints.reduce((acc, c) => {
            if (c.category) {
                acc[c.category] = (acc[c.category] || 0) + 1;
            }
            return acc;
        }, {} as Record<Category, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [complaints]);

    const urgencyData = useMemo(() => {
        const counts = complaints.reduce((acc, c) => {
            if (c.urgency) {
                acc[c.urgency] = (acc[c.urgency] || 0) + 1;
            }
            return acc;
        }, {} as Record<Urgency, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [complaints]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Complaints" value={stats.total} icon={ChartPieIcon} color="bg-blue-500" />
                <StatCard title="Open Complaints" value={stats.open} icon={DocumentCheckIcon} color="bg-green-500" />
                <StatCard title="High Urgency" value={stats.highUrgency} icon={ExclamationCircleIcon} color="bg-red-500" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="font-bold text-lg mb-4">Complaints by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            {/* FIX: The 'percent' prop from recharts can be undefined. Using `typeof percent === 'number'` provides a more robust type guard to prevent runtime errors. */}
                            <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => (typeof percent === 'number' ? `${name} ${(percent * 100).toFixed(0)}%` : name)}>
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="font-bold text-lg mb-4">Complaints by Urgency</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={urgencyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip wrapperClassName="dark:bg-gray-900" />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-4">Complaint Locations</h3>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Heatmap component would be implemented here using a library like React-Leaflet.</p>
                </div>
            </div>
        </div>
    );
};
