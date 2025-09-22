import React, { useState, useEffect, useCallback } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { User, Complaint, Status, Notification } from '../types';
import { subscribeToComplaints, updateComplaint, addComplaint } from '../services/complaintService';
import { classifyComplaint } from '../services/geminiService';
import { subscribeToNotifications, addNotification, markNotificationAsRead } from '../services/notificationService';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ComplaintList } from './ComplaintList';
import { DashboardView } from './DashboardView';
import { NewComplaintModal } from './NewComplaintModal';
import { NotificationPanel } from './NotificationPanel';


const ADMINS = ['admin01', 'admin02', 'admin03'];

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <div className="max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">An Error Occurred</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{message}</p>
        </div>
    </div>
);

export default function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const unsubscribeComplaints = subscribeToComplaints(
            (newComplaints) => {
                setComplaints(newComplaints);
                setLoading(false);
            },
            () => {
                setError("Could not load complaints. This is likely due to Firestore security rules. Please check the README for instructions on how to fix this.");
                setLoading(false);
            }
        );

        const unsubscribeNotifications = subscribeToNotifications((newNotifications) => {
            setNotifications(newNotifications);
        });

        return () => {
            unsubscribeComplaints();
            unsubscribeNotifications();
        };
    }, []);

    const handleUpdateStatus = useCallback(async (id: string, newStatus: Status) => {
        const complaint = complaints.find(c => c.id === id);
        if (complaint && complaint.status !== newStatus) {
            await updateComplaint(id, { status: newStatus }, { adminId: user.id, action: `Status changed to ${newStatus}`, details: `Previous status was ${complaint.status}` });
        }
    }, [complaints, user.id]);

    const handleAssign = useCallback(async (id: string, adminId: string) => {
        const complaint = complaints.find(c => c.id === id);
        const newAssignedTo = adminId === "" ? null : adminId;
        if (complaint && complaint.assignedTo !== newAssignedTo) {
             await updateComplaint(id, { assignedTo: newAssignedTo, status: Status.Assigned }, { adminId: user.id, action: `Assigned to ${newAssignedTo || 'Unassigned'}`, details: `Previously assigned to ${complaint.assignedTo || 'Unassigned'}` });
        }
    }, [complaints, user.id]);

    const handleCreateComplaint = async (text: string, location: { lat: number; lng: number } | null) => {
        setIsModalOpen(false);

        const newComplaintData: Omit<Complaint, 'id' | 'timestamp' | 'auditLog'> = {
            text,
            submittedBy: user.id,
            status: Status.Submitted,
            urgency: null,
            category: null,
            department: null,
            assignedTo: null,
            location: location || undefined,
        };

        const complaintId = await addComplaint(newComplaintData);
        
        // Post-creation AI classification runs in the background
        const classification = await classifyComplaint(text);
        if (classification) {
            await updateComplaint(
                complaintId,
                { ...classification, status: Status.Classified },
                { adminId: 'system-ai', action: 'Classified', details: `Urgency: ${classification.urgency}, Category: ${classification.category}, Department: ${classification.department}` }
            );
            // Create a notification for the new assignment
            await addNotification({
                complaintId: complaintId,
                message: `Complaint #${complaintId.substring(0, 4)} auto-assigned to ${classification.department}.`,
            });
        }
    };
    
    const unreadNotificationCount = notifications.filter(n => !n.read).length;

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-full">
                   <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            );
        }
        if (error) {
            return <ErrorDisplay message={error} />;
        }
        if (activeView === 'dashboard') {
            return <DashboardView complaints={complaints} />;
        }
        return (
            <ComplaintList 
              complaints={complaints} 
              onUpdateStatus={handleUpdateStatus} 
              onAssign={handleAssign}
              admins={ADMINS}
            />
        );
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    title="Admin Dashboard" 
                    user={user} 
                    onLogout={onLogout} 
                    onNewComplaint={() => setIsModalOpen(true)}
                    unreadCount={unreadNotificationCount}
                    onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
                />
                 {isNotificationsOpen && (
                    <NotificationPanel 
                        notifications={notifications} 
                        onClose={() => setIsNotificationsOpen(false)} 
                        onMarkAsRead={markNotificationAsRead}
                    />
                )}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
                    {renderContent()}
                </main>
            </div>
            {isModalOpen && <NewComplaintModal onClose={() => setIsModalOpen(false)} onCreate={handleCreateComplaint} />}
        </div>
    );
}
