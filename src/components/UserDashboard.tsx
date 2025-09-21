import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Complaint, Status } from '../types';
import { subscribeToComplaints, addComplaint, updateComplaint } from '../services/complaintService';
import { classifyComplaint } from '../services/geminiService';
import { Header } from './Header';
import { NewComplaintModal } from './NewComplaintModal';
import { UserComplaintList } from './UserComplaintList';

export default function UserDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
    const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = subscribeToComplaints((newComplaints) => {
            setAllComplaints(newComplaints);
            if (loading) setLoading(false);
        });
        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const userComplaints = useMemo(() => {
        return allComplaints.filter(c => c.submittedBy === user.id);
    }, [allComplaints, user.id]);

    const handleCreateComplaint = useCallback(async (text: string, location: { lat: number; lng: number } | null) => {
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
    }, [user.id]);

    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Header title="My Complaints" user={user} onLogout={onLogout} onNewComplaint={() => setIsModalOpen(true)} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                 {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : (
                    <UserComplaintList complaints={userComplaints} />
                )}
            </main>
            {isModalOpen && <NewComplaintModal onClose={() => setIsModalOpen(false)} onCreate={handleCreateComplaint} />}
        </div>
    );
}
