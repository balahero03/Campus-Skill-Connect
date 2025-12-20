// BrowseSkills Page - Real-time Supabase search and filtering
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SkillCard from '../components/SkillCard';
import { db } from '../config/supabase';
import { Search, Filter, X } from 'lucide-react';

const BrowseSkills = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categories = ['All', 'Design', 'Editing', 'Coding', 'Tutoring', 'Repair', 'Writing', 'Others'];

    useEffect(() => {
        searchSkills();
    }, [searchQuery, selectedCategory]);

    const searchSkills = async () => {
        setLoading(true);
        setError(null);

        const { data, error: searchError } = await db.skills.search(
            searchQuery,
            selectedCategory === 'All' ? null : selectedCategory
        );

        if (searchError) {
            setError('Failed to load skills. Please try again.');
            console.error('Error searching skills:', searchError);
        } else {
            setSkills(data || []);
        }
        setLoading(false);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Update URL params
        if (value) {
            searchParams.set('query', value);
        } else {
            searchParams.delete('query');
        }
        setSearchParams(searchParams);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);

        // Update URL params
        if (category !== 'All') {
            searchParams.set('category', category);
        } else {
            searchParams.delete('category');
        }
        setSearchParams(searchParams);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSelectedCategory('All');
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Skills</h1>
                    <p className="text-gray-600">
                        Discover talented students from Thiagarajar Polytechnic College
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by skill name, description, or provider..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        searchParams.delete('query');
                                        setSearchParams(searchParams);
                                    }}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <Filter size={18} className="text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Filter by category:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedCategory === category
                                        ? 'bg-primary-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(searchQuery || selectedCategory !== 'All') && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <span>Active filters:</span>
                                    {searchQuery && (
                                        <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded">
                                            "{searchQuery}"
                                        </span>
                                    )}
                                    {selectedCategory !== 'All' && (
                                        <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded">
                                            {selectedCategory}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={clearSearch}
                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Clear all
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-600">
                        {loading ? (
                            'Searching...'
                        ) : (
                            <>
                                Showing <span className="font-semibold text-gray-900">{skills.length}</span>{' '}
                                {skills.length === 1 ? 'result' : 'results'}
                                {searchQuery && ` for "${searchQuery}"`}
                            </>
                        )}
                    </p>
                </div>

                {/* Skills Grid */}
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
                        <p className="text-red-700 font-medium mb-4">{error}</p>
                        <button
                            onClick={searchSkills}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : skills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {skills.map((skill) => (
                            <SkillCard key={skill.id} skill={skill} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No skills found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery || selectedCategory !== 'All'
                                ? 'Try adjusting your search or filters'
                                : 'Be the first to post a skill!'}
                        </p>
                        {(searchQuery || selectedCategory !== 'All') && (
                            <button
                                onClick={clearSearch}
                                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseSkills;
