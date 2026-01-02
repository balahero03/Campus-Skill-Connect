import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, size = 16, readonly = true }) => {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((value) => {
                const isFilled = value <= rating;
                return (
                    <Star
                        key={value}
                        size={size}
                        className={`${isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                    />
                );
            })}
        </div>
    );
};

export default RatingStars;
