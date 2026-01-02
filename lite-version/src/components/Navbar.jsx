import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, User, GraduationCap } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/skills', label: 'Skills', icon: Briefcase },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <GraduationCap className="text-gray-900" size={24} />
                        <span className="font-bold text-xl text-gray-900">
                            CampusSkillConnect
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-1 sm:space-x-4">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive
                                        ? 'text-primary-700 bg-primary-50 font-semibold'
                                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span className="hidden md:inline font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
