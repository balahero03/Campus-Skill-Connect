// SkillCard Component - Display skill information in a card
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RatingStars from './RatingStars';
import { User } from 'lucide-react';

const SkillCard = ({ skill }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/skill/${skill.id}`)}
            className="card cursor-pointer border border-gray-100"
        >
            {/* Skill Image */}
            <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
                <Briefcase className="text-primary-500" size={48} />
            </div>

            {/* Skill Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                {skill.title}
            </h3>

            {/* Provider Info */}
            <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={16} className="text-gray-600" />
                </div>
                <span className="text-sm text-gray-600">{skill.provider}</span>
            </div>

            {/* Rating and Price */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <RatingStars rating={skill.rating} size={16} readonly />
                    <span className="text-sm text-gray-600">({skill.rating})</span>
                </div>
                <span className="text-lg font-bold text-primary-600">₹{skill.price}</span>
            </div>

            {/* Category Badge */}
            <div className="mt-3">
                <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full">
                    {skill.category}
                </span>
            </div>
        </div>
    );
};

// Import Briefcase icon
import { Briefcase } from 'lucide-react';

export default SkillCard;
