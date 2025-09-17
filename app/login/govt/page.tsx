'use client';

import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

const GovernmentLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

    };

    const handleSignUpClick = () => {

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
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-gray-500">
                                Sign in to continue to your dashboard.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                        placeholder="user@gov.in"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-3 py-2 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <a href="#" className="text-sm text-green-600 hover:underline">
                                        Forgot Password?
                                    </a>
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
                                        className="w-full pl-10 pr-3 py-2 bg-slate-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Link href={'/dashboard/gp'}>
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center py-3 px-4 rounded-md shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                                >
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Login
                                </button>
                            </Link>
                        </form>

                        {/* Sign Up Option */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <button
                                    onClick={handleSignUpClick}
                                    className="font-medium text-green-600 hover:underline inline-flex items-center"
                                >
                                    Sign Up Now <UserPlus className="ml-1 h-4 w-4" />
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GovernmentLoginPage;