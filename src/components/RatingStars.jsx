// RatingStars Component - Display and input star ratings
import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, onRate = null, size = 20, readonly = false }) => {
    const [hoveredRating, setHoveredRating] = React.useState(0);

    const handleClick = (value) => {
        if (!readonly && onRate) {
            onRate(value);
        }
    };

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => {
                const isFilled = value <= (hoveredRating || rating);

                return (
                    <Star
                        key={value}
                        size={size}
                        className={`${readonly ? 'cursor-default' : 'cursor-pointer'
                            } transition-colors duration-150 ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                        onClick={() => handleClick(value)}
                        onMouseEnter={() => !readonly && setHoveredRating(value)}
                        onMouseLeave={() => !readonly && setHoveredRating(0)}
                    />
                );
            })}
        </div>
    );
};

export default RatingStars;
