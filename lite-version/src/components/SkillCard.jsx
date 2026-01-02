import React from 'react';
import RatingStars from './RatingStars';
import { User, Tag } from 'lucide-react';

const SkillCard = ({ skill }) => {
    return (
        <div className="bg-white border border-gray-200 p-4 rounded-md">
            {/* Minimal Header */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 line-clamp-1">{skill.title}</h3>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {skill.category}
                </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {skill.description}
            </p>

            {/* Provider & Price - Simple Text */}
            <div className="flex items-center justify-between text-sm mt-auto pt-3 border-t border-gray-100">
                <div className="flex items-center text-gray-700">
                    <User size={14} className="mr-1.5 text-gray-400" />
                    <span>{skill.provider.name}</span>
                </div>
                <span className="font-semibold text-gray-900">₹{skill.price}</span>
            </div>
        </div>
    );
};

export default SkillCard;
