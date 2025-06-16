import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        { path: '/', label: 'Game', icon: '🎰' },
        { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
        { path: '/profile', label: 'Profile', icon: '👤' },
    ];

    const navItems: { path: string; label: string; icon: string }[] = [];

    return (
        <nav className="bg-gradient-to-r from-black via-gray-900 to-black border-b-4 border-casino-gold shadow-2xl">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-casino-gold to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-2xl">🎰</span>
                        </div>
                        <div>
                            <h1 className="text-casino-gold font-bold text-2xl tracking-wide">ROYAL CASINO</h1>
                            <p className="text-gray-400 text-sm">Premium Gaming Experience</p>
                        </div>
                    </Link>

                    {/* User Profile Section */}
                    <div className="flex items-center gap-4">
                        {/* Dropdown Menu */}
                        <div className="relative" ref={menuRef}>
                            {/* Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 bg-black bg-opacity-50 hover:bg-opacity-70 px-4 py-2 rounded-lg border border-casino-gold hover:border-yellow-300 transition-all duration-300 group"
                            >
                                <span className="text-casino-gold group-hover:text-yellow-300 transition-colors duration-300">☰</span>
                                <span className="text-casino-gold font-medium group-hover:text-yellow-300 transition-colors duration-300 hidden sm:block">Menu</span>
                                <span className={`text-casino-gold transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}>▼</span>
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-black bg-opacity-95 backdrop-blur-sm rounded-lg border border-casino-gold shadow-2xl z-50">
                                    <div className="py-2">
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-gray-700">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-casino-gold to-yellow-400 rounded-full flex items-center justify-center">
                                                    <span className="text-black font-bold">🎯</span>
                                                </div>
                                                <div>
                                                    <div className="text-casino-gold font-bold">{user?.username}</div>
                                                    <div className="text-xs text-gray-400">
                                                        <span className="text-green-400">{user?.gamesWon}W</span>
                                                        <span className="mx-1">/</span>
                                                        <span>{user?.gamesPlayed}G</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        {menuItems.map((item) => (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 hover:bg-casino-gold hover:bg-opacity-20 transition-all duration-200 ${location.pathname === item.path
                                                    ? 'bg-casino-gold bg-opacity-10 text-casino-gold border-r-2 border-casino-gold'
                                                    : 'text-gray-300 hover:text-casino-gold'
                                                    }`}
                                            >
                                                <span className="text-lg">{item.icon}</span>
                                                <span className="font-medium">{item.label}</span>
                                                {location.pathname === item.path && (
                                                    <span className="ml-auto text-casino-gold">●</span>
                                                )}
                                            </Link>
                                        ))}

                                        {/* Divider */}
                                        <div className="border-t border-gray-700 my-2"></div>

                                        {/* Logout */}
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500 hover:bg-opacity-20 hover:text-red-300 transition-all duration-200"
                                        >
                                            <span className="text-lg">🚪</span>
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative bottom border */}
            <div className="h-1 bg-gradient-to-r from-transparent via-casino-gold to-transparent opacity-50"></div>
        </nav>
    );
};

export default Navigation; 