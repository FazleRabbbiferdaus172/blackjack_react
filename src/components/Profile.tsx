import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile: React.FC = () => {
    const { user, token, logout } = useAuth();
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
            await axios.put(
                `${process.env.REACT_APP_API_URL}/api/user/profile`,
                { username: newUsername },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile');
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
        } catch (err) {
            setError('Failed to change password');
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
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/user/purchase-balance`,
                { amount: purchaseAmount },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(`Successfully purchased $${purchaseAmount} balance!`);
        } catch (err) {
            setError('Failed to purchase balance');
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
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-casino-gold mb-2 drop-shadow-lg">
                        🎯 PLAYER PROFILE 🎯
                    </h1>
                    <div className="w-32 h-1 bg-casino-gold mx-auto rounded-full"></div>
                </div>

                {/* User Info Card */}
                <div className="bg-black bg-opacity-70 rounded-2xl p-6 mb-8 border-2 border-casino-gold">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-casino-gold to-yellow-400 rounded-full flex items-center justify-center text-2xl">
                                🎰
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
                                <p className="text-casino-gold">Casino Member</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-300">Games Won</div>
                            <div className="text-2xl font-bold text-casino-gold">{user?.wins}</div>
                            <div className="text-sm text-gray-300">Total Games: {user?.gamesPlayed}</div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-black bg-opacity-70 rounded-2xl border-2 border-casino-gold overflow-hidden">
                    <div className="flex border-b border-casino-gold">
                        {[
                            { id: 'profile', label: '👤 Profile', icon: '👤' },
                            { id: 'password', label: '🔐 Password', icon: '🔐' },
                            { id: 'balance', label: '💰 Balance', icon: '💰' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 py-4 px-6 font-bold transition-all duration-200 ${activeTab === tab.id
                                        ? 'bg-casino-gold text-black'
                                        : 'text-casino-gold hover:bg-casino-gold hover:bg-opacity-20'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        {/* Messages */}
                        {message && (
                            <div className="bg-green-900 bg-opacity-70 border-2 border-green-500 text-green-300 px-4 py-3 rounded-lg mb-6 text-center">
                                <span className="text-xl mr-2">✅</span>
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-900 bg-opacity-70 border-2 border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-center">
                                <span className="text-xl mr-2">⚠️</span>
                                {error}
                            </div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div>
                                    <label className="block text-casino-gold text-sm font-bold mb-2">
                                        🎯 Username
                                    </label>
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-900 border-2 border-casino-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white font-medium"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-casino-gold to-yellow-400 text-black font-bold py-4 px-6 rounded-full hover:from-yellow-400 hover:to-casino-gold transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? '⏳ Updating...' : '💾 Update Profile'}
                                </button>
                            </form>
                        )}

                        {/* Password Tab */}
                        {activeTab === 'password' && (
                            <form onSubmit={handleChangePassword} className="space-y-6">
                                <div>
                                    <label className="block text-casino-gold text-sm font-bold mb-2">
                                        🔒 Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-900 border-2 border-casino-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white font-medium"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-casino-gold text-sm font-bold mb-2">
                                        🆕 New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-900 border-2 border-casino-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white font-medium"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-casino-gold text-sm font-bold mb-2">
                                        ✅ Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-900 border-2 border-casino-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white font-medium"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-casino-gold to-yellow-400 text-black font-bold py-4 px-6 rounded-full hover:from-yellow-400 hover:to-casino-gold transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? '⏳ Changing...' : '🔐 Change Password'}
                                </button>
                            </form>
                        )}

                        {/* Balance Tab */}
                        {activeTab === 'balance' && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-casino-gold mb-4">
                                        💰 Purchase Casino Balance 💰
                                    </h3>
                                    <p className="text-white opacity-80">
                                        Add funds to your casino account to continue playing
                                    </p>
                                </div>

                                <form onSubmit={handlePurchaseBalance} className="space-y-6">
                                    <div>
                                        <label className="block text-casino-gold text-sm font-bold mb-4">
                                            Select Amount
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {balanceOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => setPurchaseAmount(option.value)}
                                                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${purchaseAmount === option.value
                                                            ? 'border-casino-gold bg-casino-gold bg-opacity-20 text-casino-gold'
                                                            : 'border-gray-600 bg-gray-800 text-white hover:border-casino-gold'
                                                        }`}
                                                >
                                                    {option.popular && (
                                                        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                                                            Popular
                                                        </div>
                                                    )}
                                                    <div className="text-2xl font-bold">{option.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-800 rounded-lg p-4 border border-casino-gold">
                                        <div className="flex justify-between items-center text-white">
                                            <span>Amount:</span>
                                            <span className="text-casino-gold font-bold text-xl">${purchaseAmount}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-4 px-6 rounded-full hover:from-green-500 hover:to-green-400 transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-green-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {loading ? '⏳ Processing...' : `💳 Purchase $${purchaseAmount}`}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Logout Button */}
                        <div className="mt-8 pt-6 border-t border-casino-gold">
                            <button
                                onClick={logout}
                                className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 px-6 rounded-full hover:from-red-500 hover:to-red-400 transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-red-700"
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