import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile: React.FC = () => {
    const { user, token, logout, updateUserBalance, updateUserProfile } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'balance'>('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Profile update state
    const [newUsername, setNewUsername] = useState(user?.username || '');

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Balance purchase state
    const [purchaseAmount, setPurchaseAmount] = useState(100);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/user/profile`,
                { username: newUsername },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update the user profile in AuthContext
            updateUserProfile(newUsername);

            setMessage('Profile updated successfully!');
        } catch (err: any) {
            console.error('Profile update error:', err);
            const errorMessage = err.response?.data?.message || 'Failed to update profile';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/api/user/password`,
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            console.error('Password change error:', err);
            const errorMessage = err.response?.data?.message || 'Failed to change password';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchaseBalance = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/user/purchase-balance`,
                { amount: purchaseAmount },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update the user balance in AuthContext
            updateUserBalance(response.data.newBalance);

            setMessage(`Successfully purchased $${purchaseAmount} balance! New balance: $${response.data.newBalance}`);
        } catch (err: any) {
            console.error('Purchase balance error:', err);
            const errorMessage = err.response?.data?.message || 'Failed to purchase balance';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const balanceOptions = [
        { value: 100, label: '$100', popular: false },
        { value: 500, label: '$500', popular: true },
        { value: 1000, label: '$1,000', popular: false },
        { value: 2500, label: '$2,500', popular: false },
        { value: 5000, label: '$5,000', popular: false },
    ];

    return (
        <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-green-900 via-green-800 to-green-900 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        🎯 Player Profile
                    </h1>
                    <div className="w-24 h-0.5 bg-casino-gold mx-auto rounded-full opacity-60"></div>
                </div>

                {/* User Info Card */}
                <div className="bg-black bg-opacity-80 rounded-lg p-6 mb-6 border border-gray-600">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-casino-gold to-yellow-400 rounded-full flex items-center justify-center text-2xl">
                                🎰
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{user?.username}</h2>
                                <p className="text-gray-400 text-sm">Casino Member</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-400">Games Won</div>
                            <div className="text-xl font-bold text-casino-gold">{user?.gamesWon}</div>
                            <div className="text-sm text-gray-400">Total Games: {user?.gamesPlayed}</div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-black bg-opacity-80 rounded-lg border border-gray-600 overflow-hidden">
                    <div className="flex border-b border-gray-700">
                        {[
                            { id: 'profile', label: 'Profile', icon: '👤' },
                            { id: 'password', label: 'Password', icon: '🔐' },
                            { id: 'balance', label: 'Balance', icon: '💰' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 py-3 px-4 font-medium transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-black bg-opacity-60 text-casino-gold border-b-2 border-casino-gold'
                                    : 'text-gray-300 hover:bg-black hover:bg-opacity-40 hover:text-white'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {/* Messages */}
                        {message && (
                            <div className="bg-green-900 bg-opacity-50 border border-green-600 text-green-300 px-4 py-3 rounded-lg mb-6 text-center">
                                <span className="text-lg mr-2">✅</span>
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-900 bg-opacity-50 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-6 text-center">
                                <span className="text-lg mr-2">⚠️</span>
                                {error}
                            </div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        className="w-full px-4 py-3 bg-black bg-opacity-60 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-casino-gold focus:border-transparent text-white"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-casino-gold hover:bg-yellow-500 text-black font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </button>
                            </form>
                        )}

                        {/* Password Tab */}
                        {activeTab === 'password' && (
                            <form onSubmit={handleChangePassword} className="space-y-6">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-black bg-opacity-60 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-casino-gold focus:border-transparent text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-black bg-opacity-60 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-casino-gold focus:border-transparent text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-black bg-opacity-60 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-casino-gold focus:border-transparent text-white"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-casino-gold hover:bg-yellow-500 text-black font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </form>
                        )}

                        {/* Balance Tab */}
                        {activeTab === 'balance' && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        Purchase Casino Balance
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        Add funds to your casino account to continue playing
                                    </p>
                                </div>

                                <form onSubmit={handlePurchaseBalance} className="space-y-6">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-4">
                                            Select Amount
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {balanceOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => setPurchaseAmount(option.value)}
                                                    className={`relative p-4 rounded-lg border transition-all duration-200 ${purchaseAmount === option.value
                                                        ? 'border-casino-gold bg-casino-gold bg-opacity-10 text-casino-gold'
                                                        : 'border-gray-600 bg-black bg-opacity-60 text-gray-300 hover:border-gray-500 hover:text-white'
                                                        }`}
                                                >
                                                    {option.popular && (
                                                        <div className="absolute -top-2 -right-2 bg-casino-gold text-black text-xs px-2 py-1 rounded-full font-medium">
                                                            Popular
                                                        </div>
                                                    )}
                                                    <div className="text-lg font-bold">{option.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-black bg-opacity-60 rounded-lg p-4 border border-gray-600">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300">Amount:</span>
                                            <span className="text-casino-gold font-bold text-lg">${purchaseAmount}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Processing...' : `Purchase $${purchaseAmount}`}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Logout Button */}
                        <div className="mt-8 pt-6 border-t border-gray-700">
                            <button
                                onClick={logout}
                                className="w-full bg-black bg-opacity-60 hover:bg-red-600 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 border border-gray-600"
                            >
                                🚪 Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 