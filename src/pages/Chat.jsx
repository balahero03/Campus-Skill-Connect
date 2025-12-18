// Chat Page - Two-column chat interface
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ChatItem from '../components/ChatItem';
import Button from '../components/Button';
import { chats } from '../data/mockData';
import { Send, Paperclip, DollarSign, User } from 'lucide-react';

const Chat = () => {
    const [selectedChat, setSelectedChat] = useState(chats[0]);
    const [message, setMessage] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            // Mock send - In a real app, this would send to backend
            console.log('Sending message:', message);
            setMessage('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

                <div className="card p-0 overflow-hidden" style={{ height: '600px' }}>
                    <div className="grid grid-cols-12 h-full">
                        {/* Chat List - Left Column */}
                        <div className="col-span-12 md:col-span-4 border-r border-gray-200 overflow-y-auto">
                            {chats.map((chat) => (
                                <ChatItem
                                    key={chat.id}
                                    chat={chat}
                                    isActive={selectedChat?.id === chat.id}
                                    onClick={() => setSelectedChat(chat)}
                                />
                            ))}
                        </div>

                        {/* Chat Messages - Right Column */}
                        <div className="col-span-12 md:col-span-8 flex flex-col">
                            {selectedChat ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-gray-200 bg-white">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                <User size={20} className="text-gray-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                                                <p className="text-sm text-green-600">Online</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                                        <div className="space-y-4">
                                            {selectedChat.messages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.isSent
                                                                ? 'bg-primary-500 text-white'
                                                                : 'bg-white text-gray-900 border border-gray-200'
                                                            }`}
                                                    >
                                                        <p>{msg.text}</p>
                                                        <p className={`text-xs mt-1 ${msg.isSent ? 'text-primary-100' : 'text-gray-500'}`}>
                                                            {msg.timestamp}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Message Input */}
                                    <div className="p-4 border-t border-gray-200 bg-white">
                                        <div className="mb-3">
                                            <Button
                                                variant="outline"
                                                className="text-sm"
                                                onClick={() => alert('Payment link feature (UI only)')}
                                            >
                                                <DollarSign size={16} className="mr-2" />
                                                Send Payment Link
                                            </Button>
                                        </div>
                                        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                                            <button
                                                type="button"
                                                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                                                onClick={() => alert('Attachment feature (UI only)')}
                                            >
                                                <Paperclip size={20} />
                                            </button>
                                            <input
                                                type="text"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Type a message..."
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                            <button
                                                type="submit"
                                                className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                                            >
                                                <Send size={20} />
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <p>Select a chat to start messaging</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
