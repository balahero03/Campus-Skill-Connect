// SubmitWork Page - Work submission with status tracking
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { Upload, CheckCircle, Clock, FileText, Package } from 'lucide-react';

const SubmitWork = () => {
    const navigate = useNavigate();
    const [currentStatus, setCurrentStatus] = useState('In Progress');

    const statuses = [
        { name: 'Assigned', icon: FileText, completed: true },
        { name: 'In Progress', icon: Clock, completed: true },
        { name: 'Submitted', icon: Package, completed: false },
        { name: 'Completed', icon: CheckCircle, completed: false },
    ];

    const handleSubmit = () => {
        setCurrentStatus('Submitted');
        setTimeout(() => {
            navigate('/review/1');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Work</h1>
                <p className="text-gray-600 mb-8">Upload completed work and track progress</p>

                {/* Work Details Card */}
                <div className="card mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Project: Website Development</h2>
                    <p className="text-gray-600 mb-4">Client: Priya Sharma</p>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Due Date: Dec 25, 2024</span>
                        <span className="text-sm font-medium text-primary-600">₹2000</span>
                    </div>
                </div>

                {/* Status Progress */}
                <div className="card mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Project Status</h2>
                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
                            <div
                                className="h-full bg-primary-500 transition-all duration-500"
                                style={{
                                    width: `${(statuses.findIndex((s) => s.name === currentStatus) + 1) * (100 / statuses.length)
                                        }%`,
                                }}
                            />
                        </div>

                        {/* Status Steps */}
                        <div className="relative flex justify-between">
                            {statuses.map((status, index) => {
                                const Icon = status.icon;
                                const isActive = status.name === currentStatus;
                                const isCompleted = statuses.findIndex((s) => s.name === currentStatus) >= index;

                                return (
                                    <div key={status.name} className="flex flex-col items-center">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${isCompleted
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-gray-200 text-gray-400'
                                                } ${isActive ? 'ring-4 ring-primary-100' : ''}`}
                                        >
                                            <Icon size={24} />
                                        </div>
                                        <span
                                            className={`text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'
                                                }`}
                                        >
                                            {status.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="card mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Completed Work</h2>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-500 transition-colors duration-200 cursor-pointer mb-4">
                        <Upload className="mx-auto text-gray-400 mb-3" size={48} />
                        <p className="text-gray-700 font-medium mb-1">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">
                            ZIP, PDF, images, or source code files
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Maximum file size: 50MB</p>
                    </div>

                    {/* Uploaded Files (Mock) */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h3>
                        <div className="text-sm text-gray-500">No files uploaded yet</div>
                    </div>

                    {/* Additional Notes */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Notes (Optional)
                        </label>
                        <textarea
                            rows="4"
                            placeholder="Add any notes or instructions for the client..."
                            className="input-field resize-none"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <Button onClick={handleSubmit} className="flex-1">
                        {currentStatus === 'Submitted' ? 'Submitted Successfully!' : 'Confirm Submission'}
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/dashboard')}>
                        Save Draft
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SubmitWork;
