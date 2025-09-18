'use client';

import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading';
import { ApiError } from '@/components/ui/error-boundary';
import { UserRole } from '@/lib/types/api';

const CitizenSignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const { signup, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            router.push('/claims/new');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!name || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        const success = await signup({ name, email, password, role: UserRole.VillagePerson });
        if (success) {
            router.push('/claims/new');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

                <div className="relative hidden lg:flex flex-col justify-between p-12 bg-green-800 text-white">
                    <div
                        className="absolute inset-0 bg-cover bg-center z-0 opacity-20"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')" }}
                    ></div>

                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold tracking-tight">Forest Rights Act Portal</h1>
                        <p className="mt-2 text-green-200">Empowering tribal communities and forest dwellers.</p>
                    </div>

                    <div className="relative z-10 text-sm">
                        <p className="text-green-300">© 2025 Ministry of Tribal Affairs, Government of India</p>
                    </div>
                </div>

                {/* Right Column: Form Panel */}
                <div className="flex flex-col justify-center items-center p-8 sm:p-12">
                    <div className="w-full max-w-md">
                        <div className="text-center lg:text-left mb-10">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Create Citizen Account
                            </h2>
                            <p className="mt-2 text-gray-500">
                                Sign up to file a new claim or check your claim status.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Error Display */}
                            <ApiError error={error} onRetry={() => setError(null)} />

                            {/* Name Input */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Your Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="w-full pl-10 pr-3 py-2 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="user@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="w-full pl-10 pr-3 py-2 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="w-full pl-10 pr-3 py-2 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center py-3 px-4 rounded-md shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <LoadingSpinner size="sm" className="mr-2" />
                                ) : (
                                    <UserPlus className="mr-2 h-4 w-4" />
                                )}
                                {isLoading ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </form>

                        {/* Sign In Option */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/login/citizen" className="font-medium text-green-600 hover:underline inline-flex items-center">
                                    Login <LogIn className="ml-1 h-4 w-4" />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CitizenSignupPage;
