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
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Notification } from '../types';

// In a real app, notifications would likely be a subcollection per user
// or have rules to restrict access. For this demo, it's a global collection.
const notificationsCollection = collection(db, 'notifications');

const fromFirestore = (doc: any): Notification => {
    const data = doc.data();
    return {
        ...data,
        id: doc.id,
        timestamp: (data.timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as Notification;
};

export const subscribeToNotifications = (
    callback: (notifications: Notification[]) => void
) => {
    const q = query(notificationsCollection, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notifications = querySnapshot.docs.map(fromFirestore);
        callback(notifications);
    }, (error) => {
        console.error("Error fetching notifications:", error);
    });

    return unsubscribe;
};

export const addNotification = async (
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
): Promise<string> => {
    const newDoc = await addDoc(notificationsCollection, {
        ...notification,
        timestamp: serverTimestamp(),
        read: false,
    });
    return newDoc.id;
};


export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
        read: true,
    });
};
