// Chat Page - Real-time messaging with Supabase
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { db, supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { Send, Paperclip, DollarSign, User, MessageSquare } from 'lucide-react';

const Chat = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const subscriptionRef = useRef(null);

    // Load user's chats on mount
    useEffect(() => {
        if (user) {
            loadChats();
        }
    }, [user]);

    // Load messages when a chat is selected
    useEffect(() => {
        if (selectedChat) {
            loadMessages(selectedChat.id);
            subscribeToMessages(selectedChat.id);
        }
        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
        };
    }, [selectedChat]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadChats = async (silent = false) => {
        if (!silent) setLoading(true);
        const { data, error } = await db.chats.getByUserId(user.id);
        if (error) {
            console.error('Error loading chats:', error);
        } else {
            // Format chats for display
            const formattedChats = data.map(chat => {
                const isUser1 = chat.user1_id === user.id;
                const otherUser = isUser1 ? chat.user2 : chat.user1;
                const otherUserId = isUser1 ? chat.user2_id : chat.user1_id;

                // Sort messages to find latest
                const sortedMessages = chat.messages?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || [];
                const lastMsg = sortedMessages[0];

                return {
                    ...chat,
                    otherUserId,
                    name: otherUser?.name || 'User',
                    avatar_url: otherUser?.avatar_url,
                    lastMessage: lastMsg?.text || 'No messages yet',
                    lastMessageTime: lastMsg?.created_at
                };
            });
            setChats(formattedChats);

            // Check for chat ID in navigation state (Auto-select chat)
            if (location.state?.chatId) {
                const targetChat = formattedChats.find(c => c.id === location.state.chatId);
                if (targetChat) {
                    setSelectedChat(targetChat);
                }
            }
        }
        if (!silent) setLoading(false);
    };

    const loadMessages = async (chatId) => {
        const { data, error } = await db.messages.getByChatId(chatId);
        if (error) {
            console.error('Error loading messages:', error);
        } else {
            setMessages(data || []);
        }
    };

    const subscribeToMessages = (chatId) => {
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
        }

        subscriptionRef.current = supabase
            .channel(`messages:${chatId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_id=eq.${chatId}`,
                },
                (payload) => {
                    // Dedupe messages (in case optimistic update already added it)
                    setMessages((prev) => {
                        if (prev.some(m => m.id === payload.new.id)) return prev;
                        return [...prev, payload.new];
                    });
                }
            )
            .subscribe();
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        const text = newMessage.trim();

        // Optimistic: Clear input immediately
        setNewMessage('');

        const messageData = {
            chat_id: selectedChat.id,
            sender_id: user.id,
            text: text,
        };

        const { data, error } = await db.messages.send(messageData);

        if (error) {
            console.error('Error sending message:', error);
            alert(`Failed to send message: ${error.message || 'Unknown error'}`);
            setNewMessage(text);
        } else if (data) {
            // Manually add to list if not already there
            setMessages((prev) => {
                if (prev.some(m => m.id === data.id)) return prev;
                return [...prev, data];
            });

            // Update chat timestamp to move it to top
            await db.chats.update(selectedChat.id, { updated_at: new Date().toISOString() });

            // Refresh chat list (silent)
            loadChats(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

                <div className="card p-0 overflow-hidden h-[600px] md:h-[calc(100vh-140px)]">
                    <div className="grid grid-cols-12 h-full">
                        {/* Chat List - Left Column */}
                        <div className="col-span-12 md:col-span-4 border-r border-gray-200 overflow-y-auto bg-white">
                            {loading ? (
                                <div className="p-4 text-center text-gray-500">Loading chats...</div>
                            ) : chats.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                                    <MessageSquare size={40} className="mb-2 text-gray-300" />
                                    <p>No chats yet</p>
                                    <p className="text-xs mt-1">Start a conversation from a skill page</p>
                                </div>
                            ) : (
                                chats.map((chat) => (
                                    <div
                                        key={chat.id}
                                        onClick={() => setSelectedChat(chat)}
                                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-primary-500' : ''
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                                {chat.avatar_url ? (
                                                    <img src={chat.avatar_url} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                                                ) : (
                                                    <User size={24} className="text-gray-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline">
                                                    <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                                                    {chat.lastMessageTime && (
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(chat.lastMessageTime).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {chat.lastMessage}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Chat Messages - Right Column */}
                        <div className="col-span-12 md:col-span-8 flex flex-col bg-gray-50">
                            {selectedChat ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-gray-200 bg-white shadow-sm z-10">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                {selectedChat.avatar_url ? (
                                                    <img src={selectedChat.avatar_url} alt={selectedChat.name} className="w-10 h-10 rounded-full object-cover" />
                                                ) : (
                                                    <User size={20} className="text-gray-600" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                                                <p className="text-xs text-green-600 flex items-center">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                                    Online
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {messages.length === 0 ? (
                                            <div className="text-center text-gray-400 mt-10">
                                                <p>No messages yet. Say hello! 👋</p>
                                            </div>
                                        ) : (
                                            messages.map((msg) => {
                                                const isMyMessage = msg.sender_id === user.id;
                                                return (
                                                    <div
                                                        key={msg.id}
                                                        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div
                                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${isMyMessage
                                                                ? 'bg-primary-600 text-white rounded-br-none'
                                                                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                                                                }`}
                                                        >
                                                            <p>{msg.text}</p>
                                                            <p className={`text-[10px] mt-1 text-right ${isMyMessage ? 'text-primary-100' : 'text-gray-400'
                                                                }`}>
                                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Message Input */}
                                    <div className="p-4 bg-white border-t border-gray-200">
                                        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                                            <button
                                                type="button"
                                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                                                title="Attach file"
                                            >
                                                <Paperclip size={20} />
                                            </button>
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type a message..."
                                                className="flex-1 px-4 py-2 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!newMessage.trim()}
                                                className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                            >
                                                <Send size={20} />
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                        <MessageSquare size={40} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700">Your Messages</h3>
                                    <p className="text-sm text-gray-500 mt-1">Select a chat to start messaging</p>
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
