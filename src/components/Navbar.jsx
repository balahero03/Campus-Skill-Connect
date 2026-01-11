// Navbar Component - Professional with College Branding and Logout
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Briefcase, MessageCircle, User, LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, userProfile } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const navItems = [
        { path: '/dashboard', label: 'Home', icon: Home },
        { path: '/browse-skills', label: 'Skills', icon: Briefcase },
        { path: '/chat', label: 'Messages', icon: MessageCircle },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    const handleLogout = async () => {
        if (isLoggingOut) return; // Prevent double-click

        setIsLoggingOut(true);
        try {
            const { error } = await logout();
            if (error) {
                console.error('Logout failed:', error);
                alert('Failed to logout. Please try again.');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Logout error:', err);
            alert('An error occurred during logout.');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo with College Branding */}
                    <Link to="/dashboard" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                                CampusSkillConnect
                            </span>
                            <p className="text-xs text-gray-500 font-medium">TPC Salem</p>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive
                                        ? 'text-primary-700 bg-primary-50 font-semibold shadow-sm'
                                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span className="hidden md:inline font-medium">{item.label}</span>
                                </Link>
                            );
                        })}

                        {/* User Profile & Logout */}
                        <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                            {userProfile?.avatar_url && (
                                <img
                                    src={userProfile.avatar_url}
                                    alt={userProfile.name}
                                    className="w-8 h-8 rounded-full border-2 border-primary-200"
                                />
                            )}
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${isLoggingOut
                                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                                    }`}
                                title="Logout"
                            >
                                <LogOut size={18} className={isLoggingOut ? 'animate-spin' : ''} />
                                <span className="hidden lg:inline text-sm font-medium">
                                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
