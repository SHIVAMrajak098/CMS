import React, { useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, initializationError } from './firebaseConfig';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';
import Blocked from './components/Blocked';
import { User, Role, Department } from './types';
import DebugEnv from './components/DebugEnv';
import useIsMobile from './hooks/useIsMobile';
import PublicDashboard from './components/PublicDashboard';

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const isMobile = useIsMobile();
    
    // This is a simple client-side routing solution
    const isPublicRoute = window.location.pathname === '/public';

    useEffect(() => {
        if (isPublicRoute) {
            setLoading(false);
            return;
        }

        if (initializationError) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                const email = firebaseUser.email || '';
                let role: Role = Role.User;
                let department: Department | undefined = undefined;

                if (email === 'admin@example.com') {
                    role = Role.Admin;
                } else if (email === 'manager@sanitation.com') {
                    role = Role.DepartmentHead;
                    department = Department.Sanitation;
                } else if (email === 'manager@pwd.com') {
                    role = Role.DepartmentHead;
                    department = Department.PublicWorks;
                }
                
                setUser({
                    id: firebaseUser.uid,
                    email: email,
                    role: role,
                    department: department,
                });

            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isPublicRoute]);

    const handleLogout = useCallback(() => {
        signOut(auth).catch((error) => console.error("Logout failed", error));
    }, []);

    if (isPublicRoute) {
        return <PublicDashboard />;
    }
    
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

    if (user.role === Role.Admin || user.role === Role.DepartmentHead) {
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