import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                await login(username, password);
            } else {
                await register(username, password);
            }
        } catch (err) {
            setError(isLogin ? 'Login failed' : 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4">
            {/* Casino Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-casino-gold to-transparent transform rotate-45"></div>
            </div>

            <div className="relative bg-black bg-opacity-80 rounded-2xl p-8 shadow-2xl w-full max-w-md border-2 border-casino-gold">
                {/* Casino Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-casino-gold mb-2 drop-shadow-lg">
                        🎰 CASINO 🎰
                    </h1>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {isLogin ? 'Welcome Back!' : 'Join the Game!'}
                    </h2>
                    <div className="w-32 h-1 bg-casino-gold mx-auto rounded-full"></div>
                </div>

                {error && (
                    <div className="bg-red-900 bg-opacity-70 border-2 border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-center">
                        <span className="text-xl mr-2">⚠️</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-casino-gold text-sm font-bold mb-2">
                            🎯 Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900 border-2 border-casino-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white font-medium"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-casino-gold text-sm font-bold mb-2">
                            🔐 Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900 border-2 border-casino-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white font-medium"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-casino-gold to-yellow-400 text-black font-bold py-4 px-6 rounded-full hover:from-yellow-400 hover:to-casino-gold transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-yellow-600"
                    >
                        <span className="text-xl mr-2">
                            {isLogin ? '🎲' : '🎰'}
                        </span>
                        {isLogin ? 'ENTER CASINO' : 'JOIN CASINO'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <div className="w-full h-px bg-casino-gold opacity-30 mb-4"></div>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-casino-gold hover:text-yellow-400 transition-colors duration-200 font-medium"
                    >
                        {isLogin
                            ? "🆕 New player? Create account"
                            : '🔄 Already a member? Sign in'}
                    </button>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 left-4 text-casino-gold opacity-50">♠️</div>
                <div className="absolute top-4 right-4 text-casino-gold opacity-50">♥️</div>
                <div className="absolute bottom-4 left-4 text-casino-gold opacity-50">♣️</div>
                <div className="absolute bottom-4 right-4 text-casino-gold opacity-50">♦️</div>
            </div>
        </div>
    );
};

export default Login; 