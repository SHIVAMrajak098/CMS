import {
    collection,
    onSnapshot,
    addDoc,
    doc,
    updateDoc,
    serverTimestamp,
    query,
    orderBy,
    Timestamp,
    arrayUnion,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Complaint, Status, AuditLogEntry } from '../types';

const complaintsCollection = collection(db, 'complaints');

// Helper to convert Firestore doc to Complaint object
const fromFirestore = (doc: any): Complaint => {
    const data = doc.data();
    return {
        ...data,
        id: doc.id,
        // Convert Firestore Timestamps to ISO strings
        timestamp: (data.timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        auditLog: data.auditLog.map((entry: any) => ({
            ...entry,
            timestamp: (entry.timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        })),
    } as Complaint;
};

export const subscribeToComplaints = (callback: (complaints: Complaint[]) => void) => {
    const q = query(complaintsCollection, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const complaints = querySnapshot.docs.map(fromFirestore);
        callback(complaints);
    }, (error) => {
        console.error("Error fetching complaints:", error);
    });

    return unsubscribe;
};

export const addComplaint = async (complaint: Omit<Complaint, 'id' | 'timestamp' | 'auditLog'>): Promise<string> => {
    const newAuditEntry = {
        timestamp: serverTimestamp(),
        adminId: complaint.submittedBy,
        action: 'Submitted',
        details: 'Complaint created.',
    };

    const newDoc = await addDoc(complaintsCollection, {
        ...complaint,
        timestamp: serverTimestamp(),
        auditLog: [newAuditEntry],
    });
    return newDoc.id;
};

export const updateComplaint = async (complaintId: string, updates: Partial<Complaint>, auditEntry: Omit<AuditLogEntry, 'timestamp'>): Promise<void> => {
    const complaintRef = doc(db, 'complaints', complaintId);
    
    const newAuditLogEntry = {
        ...auditEntry,
        timestamp: serverTimestamp(),
    };
    
    await updateDoc(complaintRef, {
        ...updates,
        auditLog: arrayUnion(newAuditLogEntry),
    });
};
