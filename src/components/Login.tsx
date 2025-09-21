import React, { useState } from 'react';
import { User, Role } from '../types';
import { LockClosedIcon, AtSymbolIcon } from '@heroicons/react/24/solid';

interface LoginProps {
    onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Mock login logic. In a real app, this would use Firebase Auth.
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        setTimeout(() => {
            if ((email === 'admin@example.com' && password === 'password') || (email === 'user@example.com' && password === 'password')) {
                const isAdmin = email === 'admin@example.com';
                onLogin({
                    id: isAdmin ? 'admin01' : 'user01',
                    email,
                    role: isAdmin ? Role.Admin : Role.User,
                });
            } else {
                setError('Invalid credentials. Please try again.');
            }
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Complaint Management System</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to your account</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <AtSymbolIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                     <div className="text-sm text-left text-gray-500 dark:text-gray-400 p-4 mt-4 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Test Credentials:</h4>
                        <p><b className="font-medium text-gray-800 dark:text-gray-200">Admin Email:</b> admin@example.com</p>
                        <p><b className="font-medium text-gray-800 dark:text-gray-200">User Email:</b> user@example.com</p>
                        <p><b className="font-medium text-gray-800 dark:text-gray-200">Password:</b> password</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;