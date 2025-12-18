// Profile Page - User profile with skills and reviews
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import RatingStars from '../components/RatingStars';
import SkillCard from '../components/SkillCard';
import { currentUser, skills } from '../data/mockData';
import { User, Mail, Award, MapPin, Edit } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const userSkills = skills.filter((skill) => currentUser.postedSkills.includes(skill.id));

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <div className="card mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Profile Photo */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                                <User size={64} className="text-gray-600" />
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentUser.name}</h1>
                                    <div className="flex items-center justify-center md:justify-start mb-3">
                                        <RatingStars rating={currentUser.rating} size={20} readonly />
                                        <span className="text-gray-600 ml-2">({currentUser.rating})</span>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => alert('Edit profile feature (UI only)')}
                                    className="mt-4 md:mt-0"
                                >
                                    <Edit size={18} className="mr-2" />
                                    Edit Profile
                                </Button>
                            </div>

                            {/* User Details */}
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-700">
                                    <Award className="text-primary-600" size={20} />
                                    <span>{currentUser.department}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-700">
                                    <MapPin className="text-primary-600" size={20} />
                                    <span>{currentUser.year}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-700">
                                    <Mail className="text-primary-600" size={20} />
                                    <span>{currentUser.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posted Skills Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            My Posted Skills ({userSkills.length})
                        </h2>
                        <Button onClick={() => navigate('/post-skill')}>Post New Skill</Button>
                    </div>

                    {userSkills.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userSkills.map((skill) => (
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

                {/* Reviews Received Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Reviews Received ({currentUser.receivedReviews.length})
                    </h2>

                    {currentUser.receivedReviews.length > 0 ? (
                        <div className="space-y-4">
                            {currentUser.receivedReviews.map((review) => (
                                <div key={review.id} className="card">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                                <User size={24} className="text-gray-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{review.userName}</h3>
                                                <RatingStars rating={review.rating} size={16} readonly />
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">{review.date}</span>
                                    </div>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-8">
                            <p className="text-gray-500">No reviews yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
