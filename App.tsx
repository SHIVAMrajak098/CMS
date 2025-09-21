import React, { useState, useCallback, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';
import { User, Role } from './types';

// Mock authentication check. In a real app, this would involve checking Firebase Auth state,
// custom claims, or a user document in Firestore.
const checkAuthStatus = (): User | null => {
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            return JSON.parse(storedUser);
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('user');
    }
    return null;
};


function App() {
    const [user, setUser] = useState<User | null>(checkAuthStatus());

    const handleLogin = useCallback((loggedInUser: User) => {
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
    }, []);

    const handleLogout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
    }, []);
    
    useEffect(() => {
        const handleStorageChange = () => {
            setUser(checkAuthStatus());
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    if (user.role === Role.Admin) {
        return <Dashboard user={user} onLogout={handleLogout} />;
    }

    return <UserDashboard user={user} onLogout={handleLogout} />;
}

export default App;
