import React, { useMemo } from 'react';
import { Complaint, Status, Urgency, Category, Department } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartPieIcon, DocumentCheckIcon, ExclamationCircleIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
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
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent === 0) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export const DashboardView: React.FC<{ complaints: Complaint[] }> = ({ complaints }) => {
    const stats = useMemo(() => {
        const departmentCounts = complaints.reduce((acc, c) => {
            if (c.department) {
                acc[c.department] = (acc[c.department] || 0) + 1;
            }
            return acc;
        }, {} as Record<Department, number>);
        
        const busiestDepartment = Object.entries(departmentCounts).sort((a, b) => b[1] - a[1])[0] || ['N/A'];

        return {
            total: complaints.length,
            open: complaints.filter(c => c.status !== Status.Resolved && c.status !== Status.Closed).length,
            highUrgency: complaints.filter(c => c.urgency === Urgency.High).length,
            busiestDepartment: busiestDepartment[0]
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

    const departmentData = useMemo(() => {
        const counts = complaints.reduce((acc, c) => {
            if (c.department) {
                acc[c.department] = (acc[c.department] || 0) + 1;
            }
            return acc;
        }, {} as Record<Department, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [complaints]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Complaints" value={stats.total} icon={ChartPieIcon} color="bg-blue-500" />
                <StatCard title="Open Complaints" value={stats.open} icon={DocumentCheckIcon} color="bg-green-500" />
                <StatCard title="High Urgency" value={stats.highUrgency} icon={ExclamationCircleIcon} color="bg-red-500" />
                <StatCard title="Busiest Dept." value={stats.busiestDepartment} icon={BuildingOffice2Icon} color="bg-purple-500" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="font-bold text-lg mb-4">Complaints by Department</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={departmentData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={120} fill="#8884d8" dataKey="value" nameKey="name">
                                {departmentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="font-bold text-lg mb-4">Complaints by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip wrapperClassName="dark:!bg-gray-900 !border-gray-700" contentStyle={{backgroundColor: 'transparent'}} />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-4">Complaint Locations</h3>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Map component (e.g., React-Leaflet) would be implemented here.</p>
                </div>
            </div>
        </div>
    );
};
