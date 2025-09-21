import React, { useState, useEffect, useCallback } from 'react';
import { User, Complaint, Status } from '../types';
import { subscribeToComplaints, updateComplaint, addComplaint } from '../services/complaintService';
import { classifyComplaint } from '../services/geminiService';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ComplaintList } from './ComplaintList';
import { DashboardView } from './DashboardView';
import { NewComplaintModal } from './NewComplaintModal';

const ADMINS = ['admin01', 'admin02', 'admin03'];

export default function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = subscribeToComplaints((newComplaints) => {
            setComplaints(newComplaints);
            if (loading) setLoading(false);
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            assignedTo: null,
            location: location || undefined,
        };

        const complaintId = await addComplaint(newComplaintData);
        
        // The real-time subscription will automatically update the list.

        // Post-creation AI classification runs in the background
        const classification = await classifyComplaint(text);
        if (classification) {
            await updateComplaint(
                complaintId,
                { ...classification, status: Status.Classified },
                { adminId: 'system-ai', action: 'Classified', details: `Urgency: ${classification.urgency}, Category: ${classification.category}` }
            );
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="Admin Dashboard" user={user} onLogout={onLogout} onNewComplaint={() => setIsModalOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                           <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : activeView === 'dashboard' ? (
                        <DashboardView complaints={complaints} />
                    ) : (
                        <ComplaintList 
                          complaints={complaints} 
                          onUpdateStatus={handleUpdateStatus} 
                          onAssign={handleAssign}
                          admins={ADMINS}
                        />
                    )}
                </main>
            </div>
            {isModalOpen && <NewComplaintModal onClose={() => setIsModalOpen(false)} onCreate={handleCreateComplaint} />}
        </div>
    );
}
