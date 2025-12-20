// Review Page - Submit reviews to Supabase
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import RatingStars from '../components/RatingStars';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { db } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const Review = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [skill, setSkill] = useState(null);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSkill();
    }, [id]);

    const loadSkill = async () => {
        const { data, error } = await db.skills.getById(id);
        if (error) {
            setError('Failed to load skill details');
        } else {
            setSkill(data);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        if (!user) {
            setError('You must be logged in to submit a review');
            setSubmitting(false);
            return;
        }

        const reviewData = {
            skill_id: id,
            user_id: user.id,
            rating: rating,
            comment: feedback,
        };

        const { error: submitError } = await db.reviews.create(reviewData);

        if (submitError) {
            console.error('Error submitting review:', submitError);
            setError('Failed to submit review. Please try again.');
            setSubmitting(false);
        } else {
            setSubmitted(true);
            setTimeout(() => {
                navigate(`/skill/${id}`);
            }, 2000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="card text-center">
                        <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Submitted!</h2>
                        <p className="text-gray-600 mb-4">Thank you for your feedback</p>
                        <div className="flex justify-center mb-4">
                            <RatingStars rating={rating} size={32} readonly />
                        </div>
                        <p className="text-sm text-gray-500">Redirecting to skill page...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Write a Review</h1>
                <p className="text-gray-600 mb-8">Share your experience with the service</p>

                <form onSubmit={handleSubmit} className="card">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                            <AlertCircle className="text-red-600 flex-shrink-0 mr-3 mt-0.5" size={20} />
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Service Info */}
                    {skill && (
                        <div className="mb-8 pb-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">{skill.title}</h2>
                            <p className="text-gray-600">Provider: {skill.provider?.name || 'Student'}</p>
                        </div>
                    )}

                    {/* Rating Section */}
                    <div className="mb-8">
                        <label className="block text-lg font-medium text-gray-900 mb-4">
                            How would you rate this service? *
                        </label>
                        <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
                            <RatingStars rating={rating} onRate={setRating} size={40} />
                            <p className="text-sm text-gray-600 mt-3">
                                {rating === 0 && 'Click to rate'}
                                {rating === 1 && 'Poor'}
                                {rating === 2 && 'Fair'}
                                {rating === 3 && 'Good'}
                                {rating === 4 && 'Very Good'}
                                {rating === 5 && 'Excellent'}
                            </p>
                        </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="mb-8">
                        <label className="block text-lg font-medium text-gray-900 mb-2">
                            Share your feedback *
                        </label>
                        <p className="text-sm text-gray-600 mb-3">
                            Tell others about your experience. What did you like? What could be improved?
                        </p>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            required
                            rows="6"
                            placeholder="The service was excellent! The provider was professional, delivered on time, and the quality exceeded my expectations..."
                            className="input-field resize-none"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            {feedback.length} / 500 characters
                        </p>
                    </div>

                    {/* Tips */}
                    <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for writing a great review:</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Be specific about what you liked or didn't like</li>
                            <li>• Mention communication, quality, and timeliness</li>
                            <li>• Be honest but constructive</li>
                            <li>• Help others make informed decisions</li>
                        </ul>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={rating === 0 || submitting}
                            className="flex-1 flex items-center justify-center"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Submitting...
                                </>
                            ) : (
                                'Submit Review'
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(`/skill/${id}`)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Review;
