// SkillDetails Page - Detailed view of a skill from Supabase
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import RatingStars from '../components/RatingStars';
import { db } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Mail, Award, Briefcase, MessageCircle } from 'lucide-react';

const SkillDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [skill, setSkill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSkillDetails();
    }, [id]);

    const loadSkillDetails = async () => {
        setLoading(true);
        const { data, error: fetchError } = await db.skills.getById(id);

        if (fetchError) {
            setError('Failed to load skill details');
            console.error('Error loading skill:', fetchError);
        } else {
            setSkill(data);
        }
        setLoading(false);
    };

    const handleStartChat = async () => {
        if (!user) {
            navigate('/');
            return;
        }

        // Check if chat exists
        const { data: existingChats } = await db.chats.getByUserId(user.id);
        const existingChat = existingChats?.find(c =>
            (c.user1_id === user.id && c.user2_id === skill.provider_id) ||
            (c.user1_id === skill.provider_id && c.user2_id === user.id)
        );

        if (existingChat) {
            navigate('/chat', { state: { chatId: existingChat.id } });
        } else {
            // Create new chat
            const { data: newChat, error } = await db.chats.create({
                user1_id: user.id,
                user2_id: skill.provider_id
            });
            if (error) {
                console.error('Error creating chat:', error);
                alert('Failed to start chat');
            } else {
                navigate('/chat', { state: { chatId: newChat.id } });
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this skill? This action cannot be undone.')) {
            const { error } = await db.skills.delete(id);
            if (error) {
                alert('Failed to delete skill');
                console.error(error);
            } else {
                navigate('/dashboard');
            }
        }
    };

    // Calculate average rating from reviews
    const averageRating = skill?.reviews?.length > 0
        ? (skill.reviews.reduce((sum, r) => sum + r.rating, 0) / skill.reviews.length).toFixed(1)
        : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !skill) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {error || 'Skill not found'}
                        </h2>
                        <Button onClick={() => navigate('/browse-skills')}>
                            Back to Browse
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const provider = skill.provider;

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
                                            : skill.availability === 'Busy'
                                                ? 'bg-yellow-50 text-yellow-600'
                                                : 'bg-red-50 text-red-600'
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

                            {/* Skill Image Placeholder */}
                            <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-6 flex items-center justify-center">
                                <Briefcase className="text-primary-500" size={80} />
                            </div>

                            {/* Description */}
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">About this Service</h2>
                            <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">{skill.description}</p>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Button
                                    onClick={handleStartChat}
                                    className="w-full"
                                    disabled={user?.id === skill.provider_id}
                                >
                                    <MessageCircle size={20} className="mr-2" />
                                    {user?.id === skill.provider_id ? 'You cannot chat with yourself' : 'Start Chat with Provider'}
                                </Button>

                                {/* Delete Button for Owner */}
                                {user?.id === skill.provider_id && (
                                    <Button
                                        onClick={handleDelete}
                                        className="w-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                    >
                                        Delete Skill
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Reviews ({skill.reviews?.length || 0})
                                </h2>
                                {skill.reviews?.length > 0 && (
                                    <div className="flex items-center space-x-2">
                                        <RatingStars rating={parseFloat(averageRating)} size={20} readonly />
                                        <span className="text-lg font-semibold text-gray-900">{averageRating}</span>
                                    </div>
                                )}
                            </div>

                            {skill.reviews && skill.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {skill.reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                                            <div className="flex items-start space-x-3 mb-2">
                                                {review.reviewer?.avatar_url ? (
                                                    <img
                                                        src={review.reviewer.avatar_url}
                                                        alt={review.reviewer.name}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <User size={20} className="text-gray-600" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-semibold text-gray-900">{review.reviewer?.name || 'Student'}</p>
                                                        <RatingStars rating={review.rating} size={16} readonly />
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(review.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 ml-13">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate(`/review/${skill.id}`)}
                                        className="mt-4"
                                    >
                                        Write a Review
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Provider Card Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">About the Provider</h2>

                            {/* Provider Avatar */}
                            <div className="flex flex-col items-center mb-6">
                                {provider?.avatar_url ? (
                                    <img
                                        src={provider.avatar_url}
                                        alt={provider.name}
                                        className="w-24 h-24 rounded-full mb-3"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                                        <User size={40} className="text-gray-600" />
                                    </div>
                                )}
                                <h3 className="text-xl font-semibold text-gray-900 text-center">{provider?.name}</h3>
                                {averageRating > 0 && (
                                    <div className="flex items-center mt-2">
                                        <RatingStars rating={parseFloat(averageRating)} size={18} readonly />
                                        <span className="text-sm text-gray-600 ml-2">({averageRating})</span>
                                    </div>
                                )}
                            </div>

                            {/* Provider Details */}
                            <div className="space-y-3 mb-6">
                                {provider?.department && (
                                    <div className="flex items-center space-x-3 text-gray-700">
                                        <Award size={20} className="text-primary-600 flex-shrink-0" />
                                        <span className="text-sm">{provider.department}</span>
                                    </div>
                                )}
                                {provider?.year && (
                                    <div className="flex items-center space-x-3 text-gray-700">
                                        <MapPin size={20} className="text-primary-600 flex-shrink-0" />
                                        <span className="text-sm">{provider.year}</span>
                                    </div>
                                )}
                                {provider?.email && (
                                    <div className="flex items-center space-x-3 text-gray-700">
                                        <Mail size={20} className="text-primary-600 flex-shrink-0" />
                                        <span className="text-sm break-all">{provider.email}</span>
                                    </div>
                                )}
                            </div>

                            {provider?.bio && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-700">{provider.bio}</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <Button
                                    onClick={handleStartChat}
                                    className="w-full"
                                    disabled={user?.id === skill.provider_id}
                                >
                                    <MessageCircle size={18} className="mr-2" />
                                    Message Provider
                                </Button>
                                <Button
                                    onClick={() => navigate(`/profile`)}
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
        </div>
    );
};

export default SkillDetails;
