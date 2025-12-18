// Dashboard Page - Real Supabase Data with Professional Design
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SkillCard from '../components/SkillCard';
import Button from '../components/Button';
import { db } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { Palette, Video, Code, BookOpen, Wrench, FileText, Plus, Sparkles, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const { userProfile } = useAuth();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categories = [
        { name: 'Design', icon: Palette, color: 'from-pink-500 to-rose-500' },
        { name: 'Editing', icon: Video, color: 'from-purple-500 to-indigo-500' },
        { name: 'Coding', icon: Code, color: 'from-blue-500 to-cyan-500' },
        { name: 'Tutoring', icon: BookOpen, color: 'from-green-500 to-emerald-500' },
        { name: 'Repair', icon: Wrench, color: 'from-orange-500 to-amber-500' },
        { name: 'Writing', icon: FileText, color: 'from-indigo-500 to-purple-500' },
    ];

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        setLoading(true);
        const { data, error } = await db.skills.getAll();

        if (error) {
            setError('Failed to load skills');
            console.error('Error loading skills:', error);
        } else {
            setSkills(data || []);
        }
        setLoading(false);
    };

    const handleCategoryClick = (category) => {
        navigate(`/browse-skills?category=${category}`);
    };

    const featuredSkills = skills.slice(0, 6);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Banner with College Branding */}
                <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 rounded-3xl p-8 mb-8 shadow-xl">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 mb-4">
                            <Sparkles className="text-yellow-300" size={24} />
                            <span className="text-yellow-300 font-semibold text-sm uppercase tracking-wide">
                                Welcome to TPC's Skill Platform
                            </span>
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-3">
                            Hello, {userProfile?.name || 'Student'}! 👋
                        </h1>

                        <p className="text-primary-50 text-lg mb-6 max-w-2xl">
                            Discover talented students from Thiagarajar Polytechnic College, collaborate on exciting projects, and monetize your skills within our campus community.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                onClick={() => navigate('/browse-skills')}
                                className="bg-white text-primary-600 hover:bg-primary-50 shadow-lg hover:shadow-xl transition-all"
                            >
                                <TrendingUp size={20} className="mr-2" />
                                Explore Skills
                            </Button>
                            <Button
                                onClick={() => navigate('/post-skill')}
                                variant="outline"
                                className="bg-primary-700/30 backdrop-blur-sm text-white border-white/30 hover:bg-primary-700/50 hover:border-white/50 shadow-lg"
                            >
                                <Plus size={20} className="mr-2" />
                                Share Your Skill
                            </Button>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl"></div>
                </div>

                {/* Category Buttons - Redesigned */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
                            <p className="text-gray-600 mt-1">Find the perfect skill for your project</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.name}
                                    onClick={() => handleCategoryClick(category.name)}
                                    className="group relative overflow-hidden bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                                    <div className="relative z-10">
                                        <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="text-white" size={28} />
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-center">{category.name}</h3>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Featured Skills */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Featured Skills</h2>
                            <p className="text-gray-600 mt-1">Top rated services from your peers</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/browse-skills')}
                            className="hidden md:flex"
                        >
                            View All Skills
                        </Button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="animate-pulse">
                                    <div className="bg-white rounded-2xl h-80 border border-gray-100"></div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                            <p className="text-red-700 font-medium">{error}</p>
                            <Button onClick={loadSkills} className="mt-4">
                                Try Again
                            </Button>
                        </div>
                    ) : featuredSkills.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredSkills.map((skill) => (
                                <SkillCard key={skill.id} skill={skill} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Skills Yet</h3>
                            <p className="text-gray-600 mb-6">Be the first to share your skill with the TPC community!</p>
                            <Button onClick={() => navigate('/post-skill')}>
                                Post Your First Skill
                            </Button>
                        </div>
                    )}

                    {/* Mobile View All Button */}
                    <div className="md:hidden mt-6">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/browse-skills')}
                            className="w-full"
                        >
                            View All Skills
                        </Button>
                    </div>
                </div>

                {/* College Footer Badge */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
                        <span className="text-sm text-gray-600">Proudly serving</span>
                        <span className="text-sm font-bold text-primary-600">Thiagarajar Polytechnic College</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
