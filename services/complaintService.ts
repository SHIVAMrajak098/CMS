
import { Complaint, Status, Urgency, Category, AuditLogEntry } from '../types';

// Mock data to simulate a Firestore collection
let mockComplaints: Complaint[] = [
  {
    id: 'C001',
    text: 'Large pothole on Main Street near the intersection with Oak Avenue. It has caused damage to my car tire.',
    submittedBy: 'user01',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: Status.Assigned,
    urgency: Urgency.High,
    category: Category.Infrastructure,
    assignedTo: 'admin01',
    auditLog: [
        { timestamp: new Date().toISOString(), adminId: 'system', action: 'Submitted', details: 'Complaint received.' },
        { timestamp: new Date().toISOString(), adminId: 'system-ai', action: 'Classified', details: 'Urgency: High, Category: Infrastructure' },
        { timestamp: new Date().toISOString(), adminId: 'admin01', action: 'Assigned', details: 'Assigned to admin01' }
    ],
    location: { lat: 34.0522, lng: -118.2437 }
  },
  {
    id: 'C002',
    text: 'The city park has broken playground equipment which is a danger to children.',
    submittedBy: 'user02',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: Status.Resolved,
    urgency: Urgency.High,
    category: Category.Safety,
    assignedTo: 'admin02',
    auditLog: [],
    location: { lat: 34.055, lng: -118.25 }
  },
  {
    id: 'C003',
    text: 'My trash was not collected this week on the scheduled day.',
    submittedBy: 'user03',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: Status.Classified,
    urgency: Urgency.Medium,
    category: Category.Service,
    assignedTo: null,
    auditLog: [],
    location: { lat: 34.06, lng: -118.24 }
  },
  {
    id: 'C004',
    text: 'There was an error on my latest water bill, I was overcharged.',
    submittedBy: 'user04',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: Status.Closed,
    urgency: Urgency.Low,
    category: Category.Billing,
    assignedTo: 'admin01',
    auditLog: [],
  },
];

// In a real app, you would use the Firebase SDK here.
// e.g., import { collection, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore';

export const subscribeToComplaints = (callback: (complaints: Complaint[]) => void) => {
  // Simulate real-time updates from Firestore's onSnapshot
  const interval = setInterval(() => {
    callback([...mockComplaints]);
  }, 1000);

  // Return an unsubscribe function
  return () => clearInterval(interval);
};


export const addComplaint = async (complaint: Omit<Complaint, 'id' | 'timestamp' | 'auditLog'>): Promise<Complaint> => {
  // Simulate adding a document to Firestore with addDoc
  await new Promise(resolve => setTimeout(resolve, 500)); // simulate network latency
  
  const newComplaint: Complaint = {
    ...complaint,
    id: `C${String(mockComplaints.length + 1).padStart(3, '0')}`,
    timestamp: new Date().toISOString(),
    auditLog: [{
        timestamp: new Date().toISOString(),
        adminId: 'system',
        action: 'Submitted',
        details: 'Complaint created via admin portal.'
    }]
  };

  mockComplaints.unshift(newComplaint);
  return newComplaint;
};

export const updateComplaint = async (complaintId: string, updates: Partial<Complaint>, auditEntry: Omit<AuditLogEntry, 'timestamp'>): Promise<Complaint> => {
    // Simulate updating a document in Firestore with updateDoc
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockComplaints.findIndex(c => c.id === complaintId);
    if (index !== -1) {
        const newAuditLogEntry: AuditLogEntry = {
            ...auditEntry,
            timestamp: new Date().toISOString(),
        };

        mockComplaints[index] = { 
            ...mockComplaints[index], 
            ...updates,
            auditLog: [...mockComplaints[index].auditLog, newAuditLogEntry]
        };
        return mockComplaints[index];
    }
    throw new Error('Complaint not found');
};
