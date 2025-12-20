// Profile Page - Real User Profile from Supabase
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import RatingStars from '../components/RatingStars';
import SkillCard from '../components/SkillCard';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/supabase';
import { User, Mail, Award, MapPin, Edit, Phone, FileText } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const { userProfile } = useAuth();
    const [mySkills, setMySkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userProfile?.id) {
            loadMySkills();
        }
    }, [userProfile]);

    const loadMySkills = async () => {
        setLoading(true);
        // Fetch all skills where provider_id matches current user
        const { data, error } = await db.skills.getAll();

        if (data) {
            const userSkills = data.filter(skill => skill.provider_id === userProfile.id);
            setMySkills(userSkills);
        }
        setLoading(false);
    };

    if (!userProfile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <div className="card mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Profile Photo */}
                        <div className="flex-shrink-0">
                            {userProfile.avatar_url ? (
                                <img
                                    src={userProfile.avatar_url}
                                    alt={userProfile.name}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                                />
                            ) : (
                                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User size={64} className="text-gray-600" />
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left w-full">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{userProfile.name}</h1>
                                    {/* Placeholder for rating - could be calculated from reviews on their skills */}
                                    <div className="flex items-center justify-center md:justify-start mb-3">
                                        <RatingStars rating={5} size={20} readonly />
                                        <span className="text-gray-600 ml-2">(New User)</span>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/profile-setup')}
                                    className="mt-4 md:mt-0"
                                >
                                    <Edit size={18} className="mr-2" />
                                    Edit Profile
                                </Button>
                            </div>

                            {/* User Details */}
                            <div className="grid md:grid-cols-2 gap-4 text-sm mb-6">
                                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-700">
                                    <Award className="text-primary-600 flex-shrink-0" size={20} />
                                    <span className="font-medium">{userProfile.department || 'Department not set'}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-700">
                                    <MapPin className="text-primary-600 flex-shrink-0" size={20} />
                                    <span className="font-medium">{userProfile.year || 'Year not set'}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-700">
                                    <Mail className="text-primary-600 flex-shrink-0" size={20} />
                                    <span>{userProfile.email}</span>
                                </div>
                                {userProfile.phone && (
                                    <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-700">
                                        <Phone className="text-primary-600 flex-shrink-0" size={20} />
                                        <span>{userProfile.phone}</span>
                                    </div>
                                )}
                            </div>

                            {/* Bio */}
                            {userProfile.bio && (
                                <div className="bg-gray-50 p-4 rounded-lg text-left">
                                    <div className="flex items-center space-x-2 mb-2 text-gray-900 font-semibold">
                                        <FileText size={16} />
                                        <span>About Me</span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {userProfile.bio}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Posted Skills Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            My Posted Skills ({mySkills.length})
                        </h2>
                        <Button onClick={() => navigate('/post-skill')}>Post New Skill</Button>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        </div>
                    ) : mySkills.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mySkills.map((skill) => (
                                <SkillCard key={skill.id} skill={skill} />
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-12">
                            <p className="text-gray-500 mb-4">You haven't posted any skills yet</p>
                            <Button onClick={() => navigate('/post-skill')}>Post Your First Skill</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
