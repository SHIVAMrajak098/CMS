import React, { useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, initializationError } from './firebaseConfig';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';
import Blocked from './components/Blocked';
import { User, Role } from './types';
import DebugEnv from './components/DebugEnv';
import useIsMobile from './hooks/useIsMobile';

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const isMobile = useIsMobile();

    useEffect(() => {
        if (initializationError) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                // In a real app, role management would be more robust (e.g., custom claims)
                const isAdmin = firebaseUser.email === 'admin@example.com';
                setUser({
                    id: firebaseUser.uid,
                    email: firebaseUser.email || 'No email',
                    role: isAdmin ? Role.Admin : Role.User,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = useCallback(() => {
        signOut(auth).catch((error) => console.error("Logout failed", error));
    }, []);
    
    if (initializationError) {
        return <DebugEnv error={initializationError} />;
    }

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
    
    if (!user) {
        return <Login />;
    }

    if (user.role === Role.Admin) {
        return <Dashboard user={user} onLogout={handleLogout} />;
    }

    // User Role: Enforce mobile view
    if (isMobile) {
        return <UserDashboard user={user} onLogout={handleLogout} />;
    } else {
        return <Blocked onLogout={handleLogout} />;
    }
}

export default App;