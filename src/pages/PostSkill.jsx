// PostSkill Page - Create new skill listings in Supabase
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { db } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { Briefcase, DollarSign, Clock, Image, CheckCircle, AlertCircle } from 'lucide-react';

const PostSkill = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        availability: 'Available',
    });

    const categories = ['Design', 'Editing', 'Coding', 'Tutoring', 'Repair', 'Writing'];
    const availabilityOptions = ['Available', 'Busy', 'Not Available'];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate
        if (!formData.title || !formData.description || !formData.category || !formData.price) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        const skillData = {
            provider_id: user.id,
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            price: parseFloat(formData.price),
            availability: formData.availability,
            image_url: null, // TODO: Add image upload functionality
        };

        const { data, error: createError } = await db.skills.create(skillData);

        if (createError) {
            console.error('Error creating skill:', createError);
            setError('Failed to post skill. Please try again.');
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);

            // Redirect to skill details after 2 seconds
            setTimeout(() => {
                navigate(`/skill/${data.id}`);
            }, 2000);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-green-100">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="text-green-600" size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Skill Posted Successfully! 🎉</h2>
                        <p className="text-gray-600 mb-6">
                            Your skill has been published and is now visible to all TPC students.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => navigate('/browse-skills')}>
                                Browse Skills
                            </Button>
                            <Button variant="outline" onClick={() => window.location.reload()}>
                                Post Another
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Your Skill</h1>
                    <p className="text-gray-600">
                        Share your talents with fellow TPC students and start earning
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                            <AlertCircle className="text-red-600 flex-shrink-0 mr-3 mt-0.5" size={20} />
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <Briefcase size={18} className="text-primary-600" />
                                    <span>Skill Title *</span>
                                </div>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Professional Logo Design, Video Editing, Python Tutoring"
                                className="input-field"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="input-field"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="6"
                                placeholder="Describe your skill, what you offer, your experience, and any requirements..."
                                className="input-field resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.description.length}/1000 characters
                            </p>
                        </div>

                        {/* Price and Availability */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center space-x-2">
                                        <DollarSign size={18} className="text-primary-600" />
                                        <span>Price (₹) *</span>
                                    </div>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="500"
                                    className="input-field"
                                />
                            </div>

                            {/* Availability */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center space-x-2">
                                        <Clock size={18} className="text-primary-600" />
                                        <span>Availability *</span>
                                    </div>
                                </label>
                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                >
                                    {availabilityOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for a great listing:</h4>
                            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                <li>Use a clear, descriptive title</li>
                                <li>Explain what makes you qualified</li>
                                <li>Include any relevant experience or portfolio</li>
                                <li>Be specific about what you offer</li>
                                <li>Set a fair price based on complexity</li>
                            </ul>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} className="mr-2" />
                                        Post Skill
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/dashboard')}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostSkill;
