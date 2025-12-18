// Review Page - Submit reviews and ratings
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import RatingStars from '../components/RatingStars';
import { CheckCircle } from 'lucide-react';

const Review = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock submission
        setSubmitted(true);
        setTimeout(() => {
            navigate('/dashboard');
        }, 2000);
    };

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
                        <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
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
                    {/* Service Info */}
                    <div className="mb-8 pb-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Website Development</h2>
                        <p className="text-gray-600">Provider: Priya Sharma</p>
                    </div>

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
                        <Button type="submit" disabled={rating === 0} className="flex-1">
                            Submit Review
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/dashboard')}
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
