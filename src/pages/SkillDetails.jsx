// SkillDetails Page - Detailed view of a skill
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import RatingStars from '../components/RatingStars';
import { skills, users } from '../data/mockData';
import { User, MapPin, Mail, Award, Briefcase } from 'lucide-react';

const SkillDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const skill = skills.find((s) => s.id === parseInt(id));
    const provider = users.find((u) => u.id === skill?.providerId);

    if (!skill) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Skill not found</h2>
                        <Button onClick={() => navigate('/browse-skills')} className="mt-4">
                            Back to Browse
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Skill Header */}
                        <div className="card mb-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{skill.title}</h1>
                                    <div className="flex items-center space-x-4">
                                        <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 text-sm font-medium rounded-full">
                                            {skill.category}
                                        </span>
                                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${skill.availability === 'Available'
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-yellow-50 text-yellow-600'
                                            }`}>
                                            {skill.availability}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-primary-600">₹{skill.price}</p>
                                    <p className="text-sm text-gray-500">per service</p>
                                </div>
                            </div>

                            {/* Skill Image */}
                            <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-6 flex items-center justify-center">
                                <Briefcase className="text-primary-500" size={80} />
                            </div>

                            {/* Description */}
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">About this Service</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">{skill.description}</p>

                            {/* Action Button */}
                            <Button onClick={() => navigate('/chat')} className="w-full">
                                Start Chat with Provider
                            </Button>
                        </div>

                        {/* Reviews Section */}
                        <div className="card">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Reviews ({skill.reviews?.length || 0})
                            </h2>
                            {skill.reviews && skill.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {skill.reviews.map((review) => {
                                        const reviewer = users.find((u) => u.id === review.userId);
                                        return (
                                            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <User size={20} className="text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{reviewer?.name || 'Student'}</p>
                                                        <RatingStars rating={review.rating} size={16} readonly />
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 ml-13">{review.comment}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                            )}
                        </div>
                    </div>

                    {/* Provider Card Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">About the Provider</h2>

                            {/* Provider Avatar */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                                    <User size={40} className="text-gray-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">{provider?.name}</h3>
                                <div className="flex items-center mt-2">
                                    <RatingStars rating={provider?.rating || 0} size={18} readonly />
                                    <span className="text-sm text-gray-600 ml-2">({provider?.rating})</span>
                                </div>
                            </div>

                            {/* Provider Details */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center space-x-3 text-gray-700">
                                    <Award size={20} className="text-primary-600" />
                                    <span>{provider?.department}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-700">
                                    <MapPin size={20} className="text-primary-600" />
                                    <span>{provider?.year}</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-700">
                                    <Mail size={20} className="text-primary-600" />
                                    <span className="text-sm">{provider?.email}</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => navigate(`/profile/${provider?.id}`)}
                                variant="outline"
                                className="w-full"
                            >
                                View Full Profile
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillDetails;
