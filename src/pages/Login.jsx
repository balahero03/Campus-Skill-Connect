// Login Page - With Setup Instructions
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabaseConfigured } from '../config/supabase';
import { GraduationCap, Shield, Users, Sparkles, ArrowRight, Award, AlertTriangle } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);

        const { error } = await login();

        if (error) {
            setError(error.message || 'Failed to sign in. Please try again.');
            setIsLoading(false);
        }
        // Supabase will redirect automatically on success
    };

    // Show setup instructions if Supabase is not configured
    if (!supabaseConfigured) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-100 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 border border-orange-200">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={40} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Supabase Setup Required</h1>
                        <p className="text-gray-600">Your backend is not configured yet!</p>
                    </div>

                    <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
                        <h2 className="font-bold text-lg text-orange-900 mb-4">📋 Quick Setup Steps:</h2>
                        <ol className="space-y-3 text-sm text-gray-700">
                            <li className="flex items-start">
                                <span className="font-bold text-orange-600 mr-2">1.</span>
                                <span>Create a <strong>.env</strong> file in the project root (same folder as package.json)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="font-bold text-orange-600 mr-2">2.</span>
                                <span>Add these two lines to the .env file:</span>
                            </li>
                        </ol>

                        <div className="mt-4 bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-xs overflow-x-auto">
                            <div>VITE_SUPABASE_URL=your_supabase_url_here</div>
                            <div>VITE_SUPABASE_ANON_KEY=your_anon_key_here</div>
                        </div>

                        <ol start="3" className="space-y-3 text-sm text-gray-700 mt-4">
                            <li className="flex items-start">
                                <span className="font-bold text-orange-600 mr-2">3.</span>
                                <span>Get your credentials from <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Supabase Dashboard</a> → Settings → API</span>
                            </li>
                            <li className="flex items-start">
                                <span className="font-bold text-orange-600 mr-2">4.</span>
                                <span>Restart the dev server (<code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code>)</span>
                            </li>
                        </ol>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm text-blue-900 font-semibold mb-2">📚 Detailed Setup Guide:</p>
                        <p className="text-sm text-blue-800">
                            Open <code className="bg-blue-100 px-2 py-1 rounded">SUPABASE_SETUP.md</code> in your project folder for complete step-by-step instructions.
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Once configured, this page will show the Google login button.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Original login UI when configured
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative container mx-auto px-4 py-8 min-h-screen flex items-center">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side - Branding */}
                        <div className="text-center lg:text-left">
                            {/* College Logo & Badge */}
                            <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-full shadow-lg mb-8">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                                    <GraduationCap size={28} className="text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Official Platform</p>
                                    <p className="text-sm font-bold text-gray-800">TPC Salem</p>
                                </div>
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
                                Campus
                                <span className="block bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                                    SkillConnect
                                </span>
                            </h1>

                            {/* College Name - Prominent */}
                            <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border-2 border-primary-100">
                                <p className="text-xl font-bold text-gray-800">
                                    Thiagarajar Polytechnic College
                                </p>
                                <p className="text-md text-gray-600 font-medium">Salem, Tamil Nadu</p>
                            </div>

                            {/* Tagline */}
                            <p className="text-xl text-gray-700 mb-8 font-medium">
                                Connect with talented students • Collaborate on projects • Earn from your skills
                            </p>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <Award className="text-primary-600 mb-2 mx-auto lg:mx-0" size={24} />
                                    <p className="text-sm font-semibold text-gray-800">Verified Students</p>
                                </div>
                                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <Shield className="text-primary-600 mb-2 mx-auto lg:mx-0" size={24} />
                                    <p className="text-sm font-semibold text-gray-800">Secure Platform</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Login Card */}
                        <div className="max-w-md mx-auto w-full">
                            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100">
                                {/* Card Header */}
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <Users size={32} className="text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        Welcome Back
                                    </h2>
                                    <p className="text-gray-600">
                                        Sign in with your college Google account
                                    </p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-red-700 text-sm font-medium">{error}</p>
                                    </div>
                                )}

                                {/* Google Sign In Button */}
                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading}
                                    className="w-full group relative overflow-hidden bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-xl border-2 border-gray-300 hover:border-primary-500 transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center justify-center space-x-3">
                                        {/* Google Icon */}
                                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        <span className="text-lg">
                                            {isLoading ? 'Signing in...' : 'Sign in with Google'}
                                        </span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>

                                {/* Info Note */}
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <div className="flex items-start space-x-3">
                                        <Sparkles className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                                        <div>
                                            <p className="text-sm font-semibold text-blue-900 mb-1">
                                                For TPC Students Only
                                            </p>
                                            <p className="text-xs text-blue-700">
                                                Use your Thiagarajar Polytechnic College email address to access the platform
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <p className="text-center text-xs text-gray-500 mt-6">
                                    Exclusive platform for Thiagarajar Polytechnic College students
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-12 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-200">
                                <Users className="text-primary-600" size={24} />
                            </div>
                            <p className="text-sm font-semibold text-gray-800">Student Network</p>
                            <p className="text-xs text-gray-600">Connect across departments</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-200">
                                <Shield className="text-primary-600" size={24} />
                            </div>
                            <p className="text-sm font-semibold text-gray-800">Safe & Secure</p>
                            <p className="text-xs text-gray-600">College-verified only</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-200">
                                <Sparkles className="text-primary-600" size={24} />
                            </div>
                            <p className="text-sm font-semibold text-gray-800">Skill Growth</p>
                            <p className="text-xs text-gray-600">Learn and earn together</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
};

export default Login;
