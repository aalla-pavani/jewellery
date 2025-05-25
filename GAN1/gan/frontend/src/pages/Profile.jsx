import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineLoading3Quarters, AiOutlineCamera } from 'react-icons/ai';
import { FiTrash2, FiX } from 'react-icons/fi';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [designs, setDesigns] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDesign, setSelectedDesign] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
        fetchDesigns();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:4000/api/user/profile', {
                headers: { 'x-auth-token': token }
            });

            setUser(response.data);
            setFormData({
                name: response.data.name,
                email: response.data.email,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    const fetchDesigns = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.get('http://localhost:4000/api/images/history', {
                headers: { 'x-auth-token': token }
            });

            setDesigns(response.data);
        } catch (error) {
            console.error('Error fetching designs:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const updateData = {
                name: formData.name,
                email: formData.email
            };

            if (formData.currentPassword && formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    setError('New passwords do not match');
                    return;
                }
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            await axios.put('http://localhost:4000/api/user/profile', updateData, {
                headers: { 'x-auth-token': token }
            });

            setSuccess('Profile updated successfully');
            setIsEditing(false);
            fetchUserProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.response?.data?.error || 'Error updating profile');
        }
    };

    const handleDeleteDesign = async (designId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.delete(`http://localhost:4000/api/images/${designId}`, {
                headers: { 'x-auth-token': token }
            });

            setDesigns(prevDesigns => prevDesigns.filter(design => design._id !== designId));
            setSuccess('Design deleted successfully');
        } catch (error) {
            console.error('Error deleting design:', error);
            setError('Failed to delete design');
        }
    };

    const renderImage = (dataUrl, alt, onClick) => {
        if (!dataUrl) {
            return (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No image available</p>
                </div>
            );
        }

        let imageUrl = dataUrl;
        if (!imageUrl.startsWith('data:')) {
            imageUrl = `data:image/jpeg;base64,${dataUrl}`;
        }

        return (
            <img
                src={imageUrl}
                alt={alt}
                className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={onClick}
                onError={(e) => {
                    console.error(`Error loading ${alt} image`);
                    e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
                }}
            />
        );
    };

    const handleProfilePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handleProfilePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        try {
            // Convert image to base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(
                        'http://localhost:4000/api/user/profile/photo',
                        {
                            photoData: reader.result,
                            contentType: file.type
                        },
                        {
                            headers: {
                                'x-auth-token': token,
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    setUser(prev => ({ ...prev, profilePhoto: response.data.profilePhoto }));
                    setSuccess('Profile photo updated successfully');
                } catch (error) {
                    console.error('Error uploading profile photo:', error);
                    setError('Failed to upload profile photo');
                } finally {
                    setUploading(false);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error reading file:', error);
            setError('Failed to read image file');
            setUploading(false);
        }
    };

    const DesignModal = ({ design, onClose }) => {
        if (!design) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
                <div className="relative max-w-4xl w-full">
                    <button
                        onClick={onClose}
                        className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white text-center">Original Sketch</h3>
                            <div className="aspect-square bg-white rounded-lg overflow-hidden">
                                {renderImage(design.sketchImage, 'Original Sketch')}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white text-center">Generated Design</h3>
                            <div className="aspect-square bg-white rounded-lg overflow-hidden">
                                {renderImage(design.generatedImage, 'Generated Design')}
                            </div>
                        </div>
                    </div>
                    <div className="text-white text-center mt-4">
                        Created on {new Date(design.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
        );
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <AiOutlineLoading3Quarters className="animate-spin text-4xl text-[#414141]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div 
                                className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 cursor-pointer group"
                                onClick={handleProfilePhotoClick}
                            >
                                {user?.profilePhoto?.data ? (
                                    <img 
                                        src={user.profilePhoto.data}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <AiOutlineCamera className="text-white text-2xl" />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleProfilePhotoChange}
                            />
                            {uploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
                                    <AiOutlineLoading3Quarters className="animate-spin text-2xl text-gray-600" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-11 h-[2px] bg-[#414141]"></div>
                            <p className="font-medium text-base uppercase tracking-wide text-[#414141]">Your</p>
                        </div>
                        <h1 className="prata-regular text-5xl text-[#414141]">Profile</h1>
                    </div>

                    <div className="max-w-[1400px] mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                {error && (
                                    <div className="mb-6 bg-red-100 border-l-4 border-red-500 p-4">
                                        <p className="text-red-700">{error}</p>
                                    </div>
                                )}
                                {success && (
                                    <div className="mb-6 bg-green-100 border-l-4 border-green-500 p-4">
                                        <p className="text-green-700">{success}</p>
                                    </div>
                                )}

                                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 sticky top-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-semibold text-[#414141]">Account Information</h2>
                                        {!isEditing ? (
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(true)}
                                                className="px-4 py-2 bg-[#414141] text-white rounded-md hover:bg-black transition-colors"
                                            >
                                                Edit Profile
                                            </button>
                                        ) : null}
                                    </div>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`w-full px-3 py-2 border ${
                                                        isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'
                                                    } rounded-md focus:outline-none focus:ring-1 focus:ring-[#414141]`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`w-full px-3 py-2 border ${
                                                        isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'
                                                    } rounded-md focus:outline-none focus:ring-1 focus:ring-[#414141]`}
                                                />
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <>
                                                <div className="pt-6 border-t border-gray-200">
                                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Current Password
                                                            </label>
                                                            <input
                                                                type="password"
                                                                name="currentPassword"
                                                                value={formData.currentPassword}
                                                                onChange={handleInputChange}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#414141]"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                New Password
                                                            </label>
                                                            <input
                                                                type="password"
                                                                name="newPassword"
                                                                value={formData.newPassword}
                                                                onChange={handleInputChange}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#414141]"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Confirm New Password
                                                            </label>
                                                            <input
                                                                type="password"
                                                                name="confirmPassword"
                                                                value={formData.confirmPassword}
                                                                onChange={handleInputChange}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#414141]"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end space-x-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsEditing(false);
                                                            setFormData({
                                                                ...formData,
                                                                currentPassword: '',
                                                                newPassword: '',
                                                                confirmPassword: ''
                                                            });
                                                        }}
                                                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-4 py-2 bg-[#414141] text-white rounded-md hover:bg-black transition-colors"
                                                    >
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </form>
                                </div>
                            </div>

                            <div>
                                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                                    <h2 className="text-2xl font-semibold text-[#414141] mb-6">My Designs</h2>
                                    {designs.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 mb-4">You haven't created any designs yet</p>
                                            <button
                                                onClick={() => navigate('/generate')}
                                                className="px-4 py-2 bg-[#414141] text-white rounded-md hover:bg-black transition-colors"
                                            >
                                                Create Your First Design
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {designs.map((design) => (
                                                <div key={design._id} className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
                                                    <div 
                                                        className="grid grid-cols-1 md:grid-cols-2 gap-6 cursor-pointer"
                                                        onClick={() => setSelectedDesign(design)}
                                                    >
                                                        <div className="space-y-2">
                                                            <h3 className="text-sm font-medium text-gray-700">Original Sketch</h3>
                                                            <div className="aspect-square relative rounded-lg overflow-hidden">
                                                                {renderImage(design.sketchImage, 'Original Sketch', () => setSelectedDesign(design))}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h3 className="text-sm font-medium text-gray-700">Generated Design</h3>
                                                            <div className="aspect-square relative rounded-lg overflow-hidden">
                                                                {renderImage(design.generatedImage, 'Generated Design', () => setSelectedDesign(design))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 flex justify-between items-center">
                                                        <span className="text-sm text-gray-500">
                                                            Created on {new Date(design.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteDesign(design._id);
                                                            }}
                                                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                                            title="Delete design"
                                                        >
                                                            <FiTrash2 size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DesignModal
                        design={selectedDesign}
                        onClose={() => setSelectedDesign(null)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Profile;
