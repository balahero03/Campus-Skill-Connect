// Button Component - Reusable button with primary and secondary variants
import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    onClick,
    type = 'button',
    className = '',
    disabled = false
}) => {
    const baseClasses = 'px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'bg-white text-primary-500 border-2 border-primary-500 hover:bg-primary-50',
        outline: 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
