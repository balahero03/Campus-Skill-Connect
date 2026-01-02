import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Campus Skill Connect
            </h1>
            <p className="text-lg text-gray-600 mb-8">
                A simple platform for students to share skills and services.
            </p>

            <div className="flex justify-center gap-4">
                <Link to="/skills" className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors">
                    Browse Skills
                </Link>
                <Link to="/skills" className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors">
                    Post a Skill
                </Link>
            </div>
        </div>
    );
};

export default Home;
