// ChatItem Component - Chat list item
import React from 'react';
import { User } from 'lucide-react';

const ChatItem = ({ chat, isActive, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`flex items-center space-x-3 p-4 cursor-pointer transition-colors duration-150 border-b border-gray-100 ${isActive ? 'bg-primary-50' : 'hover:bg-gray-50'
                }`}
        >
            {/* Avatar */}
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-gray-600" />
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {chat.name}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
            </div>

            {/* Unread Badge */}
            {chat.unread > 0 && (
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-medium">{chat.unread}</span>
                </div>
            )}
        </div>
    );
};

export default ChatItem;
