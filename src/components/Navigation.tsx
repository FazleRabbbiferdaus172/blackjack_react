import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Game', icon: '🎰' },
        { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    ];

    return (
        <nav className="bg-gradient-to-r from-black via-gray-900 to-black border-b-4 border-casino-gold shadow-2xl">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-casino-gold to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-2xl">🎰</span>
                        </div>
                        <div>
                            <h1 className="text-casino-gold font-bold text-2xl tracking-wide">ROYAL CASINO</h1>
                            <p className="text-gray-400 text-sm">Premium Gaming Experience</p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center bg-black bg-opacity-50 rounded-full p-2 border border-casino-gold border-opacity-30">
                        {navItems.map((item, index) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative px-6 py-3 mx-1 rounded-full font-medium transition-all duration-300 group ${location.pathname === item.path
                                    ? 'bg-casino-gold text-black shadow-lg transform scale-105'
                                    : 'text-casino-gold hover:bg-casino-gold hover:bg-opacity-20 hover:transform hover:scale-105'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="font-semibold">{item.label}</span>
                                </div>

                                {/* Active indicator */}
                                {location.pathname === item.path && (
                                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                                )}

                                {/* Hover glow effect */}
                                <div className="absolute inset-0 rounded-full bg-casino-gold opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            </Link>
                        ))}
                    </div>

                    {/* User Profile Section */}
                    <div className="flex items-center gap-4">
                        {/* User Stats */}
                        <div className="text-right hidden md:block">
                            <div className="text-casino-gold font-bold text-lg">{user?.username}</div>
                            <div className="text-sm text-gray-400">
                                <span className="text-green-400">{user?.wins}W</span>
                                <span className="mx-1 text-gray-500">/</span>
                                <span className="text-gray-300">{user?.gamesPlayed}G</span>
                            </div>
                        </div>

                        {/* Clickable User Avatar */}
                        <Link to="/profile" className="relative group">
                            <div className={`w-12 h-12 bg-gradient-to-br from-casino-gold to-yellow-400 rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl ${location.pathname === '/profile'
                                ? 'border-yellow-300 ring-2 ring-casino-gold ring-opacity-50'
                                : 'border-yellow-500 group-hover:border-yellow-300'
                                }`}>
                                <span className="text-black font-bold text-lg group-hover:scale-110 transition-transform duration-300">🎯</span>
                            </div>

                            {/* Online indicator */}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black group-hover:bg-green-400 transition-colors duration-300"></div>

                            {/* Hover tooltip */}
                            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-casino-gold text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                                View Profile
                            </div>
                        </Link>

                        {/* Mobile user info - also clickable */}
                        <Link to="/profile" className="md:hidden group">
                            <div className="text-casino-gold font-bold text-sm group-hover:text-yellow-300 transition-colors duration-300">{user?.username}</div>
                            <div className="text-xs text-gray-400">
                                {user?.wins}W / {user?.gamesPlayed}G
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative bottom border */}
            <div className="h-1 bg-gradient-to-r from-transparent via-casino-gold to-transparent opacity-50"></div>
        </nav>
    );
};

export default Navigation; 