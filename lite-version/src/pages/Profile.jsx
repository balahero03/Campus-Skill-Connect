import React from 'react';
import { currentUser } from '../data/mockData';
import { MapPin, Mail, Award, Edit2 } from 'lucide-react';

const Profile = () => {
    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

            <div className="bg-white border border-gray-200 rounded-md p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                        <p className="text-gray-900">{currentUser.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                        <p className="text-gray-900">{currentUser.department}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Year</label>
                        <p className="text-gray-900">{currentUser.year}</p>
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Bio</label>
                    <p className="text-gray-900">{currentUser.bio}</p>
                </div>

                {/* Stats or Ratings could go here as simple text */}
                <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        Rating: <span className="font-medium text-gray-900">{currentUser.rating}/5.0</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
