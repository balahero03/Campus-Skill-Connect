// ProfileSetup Page - For new users to complete their profile
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { User, Building, Calendar, Phone, FileText, CheckCircle } from 'lucide-react';

const ProfileSetup = () => {
    const navigate = useNavigate();
    const { user, userProfile, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: userProfile?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
        department: userProfile?.department || '',
        year: userProfile?.year || '',
        phone: userProfile?.phone || '',
        bio: userProfile?.bio || '',
    });

    const departments = [
        'Computer Engineering',
        'Electronics & Communication Engineering',
        'Electrical & Electronics Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Automobile Engineering',
        'Information Technology',
    ];

    const years = ['1st Year', '2nd Year', '3rd Year'];

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

        const { error } = await updateProfile(formData);

        if (error) {
            setError('Failed to update profile. Please try again.');
            setLoading(false);
        } else {
            // Success - redirect to dashboard
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <User size={40} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
                        <p className="text-gray-600">
                            Tell us about yourself to get started with CampusSkillConnect
                        </p>
                    </div>

                    {/* Info Badge */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-blue-900">
                            <strong>👋 Welcome!</strong> We've pre-filled your name from your Google account.
                            Please complete the remaining details.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <User size={18} className="text-primary-600" />
                                    <span>Full Name *</span>
                                </div>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Your full name"
                                className="input-field"
                            />
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <Building size={18} className="text-primary-600" />
                                    <span>Department *</span>
                                </div>
                            </label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                                className="input-field"
                            >
                                <option value="">Select your department</option>
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Year */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <Calendar size={18} className="text-primary-600" />
                                    <span>Year *</span>
                                </div>
                            </label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                className="input-field"
                            >
                                <option value="">Select your year</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <Phone size={18} className="text-primary-600" />
                                    <span>Phone Number (Optional)</span>
                                </div>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 1234567890"
                                className="input-field"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <FileText size={18} className="text-primary-600" />
                                    <span>Bio (Optional)</span>
                                </div>
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Tell us about yourself, your skills, and interests..."
                                className="input-field resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.bio.length}/500 characters
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} className="mr-2" />
                                        Complete Setup
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            You can update these details anytime from your profile page
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;
