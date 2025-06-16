import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface LeaderboardEntry {
    username: string;
    gamesWon: number;
    gamesPlayed: number;
    winRate: number;
}

const Leaderboard: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication required');
                    setLoading(false);
                    return;
                }

                const response = await axios.get<LeaderboardEntry[]>(
                    `${process.env.REACT_APP_API_URL}/api/leaderboard`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setLeaderboard(response.data);
                setError(''); // Clear any previous errors
            } catch (err: any) {
                console.error('Leaderboard fetch error:', err);
                if (err.response?.status === 401) {
                    setError('Authentication failed. Please log in again.');
                } else if (err.response?.status === 500) {
                    setError('Server error. Please try again later.');
                } else {
                    setError('Failed to fetch leaderboard. Please check your connection.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const refreshLeaderboard = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                return;
            }

            const response = await axios.get<LeaderboardEntry[]>(
                `${process.env.REACT_APP_API_URL}/api/leaderboard`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setLeaderboard(response.data);
        } catch (err: any) {
            console.error('Leaderboard refresh error:', err);
            if (err.response?.status === 401) {
                setError('Authentication failed. Please log in again.');
            } else {
                setError('Failed to refresh leaderboard.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-casino-gold text-6xl mb-4">🎰</div>
                    <div className="text-white text-xl">Loading leaderboard...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-6xl mb-4">❌</div>
                    <div className="text-white text-xl">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-green-900 via-green-800 to-green-900 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <h1 className="text-4xl font-bold text-casino-gold drop-shadow-lg">
                            🏆 LEADERBOARD 🏆
                        </h1>
                        <button
                            onClick={refreshLeaderboard}
                            disabled={loading}
                            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-casino-gold hover:text-yellow-300 px-3 py-2 rounded-lg border border-casino-gold hover:border-yellow-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Refresh leaderboard"
                        >
                            {loading ? '⏳' : '🔄'}
                        </button>
                    </div>
                    <p className="text-lg text-gray-300">
                        Top players in the Royal Casino
                    </p>
                </div>

                {/* Leaderboard Table */}
                <div className="bg-black bg-opacity-50 rounded-lg p-6 shadow-2xl">
                    {leaderboard.length > 0 ? (
                        <div className="space-y-3">
                            {leaderboard.map((player, index) => (
                                <div
                                    key={`${player.username}-${index}`}
                                    className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 hover:bg-opacity-40 ${index === 0
                                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black shadow-lg'
                                        : index === 1
                                            ? 'bg-gradient-to-r from-gray-400 to-gray-300 text-black shadow-md'
                                            : index === 2
                                                ? 'bg-gradient-to-r from-yellow-700 to-yellow-600 text-black shadow-md'
                                                : 'bg-black bg-opacity-30 text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            {index === 0 && <span className="text-2xl">👑</span>}
                                            {index === 1 && <span className="text-2xl">🥈</span>}
                                            {index === 2 && <span className="text-2xl">🥉</span>}
                                            <span className={`font-bold text-xl w-8 text-center ${index < 3 ? 'text-black' : 'text-casino-gold'
                                                }`}>
                                                #{index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <div className={`font-bold text-lg ${index < 3 ? 'text-black' : 'text-white'
                                                }`}>
                                                {player.username}
                                            </div>
                                            <div className={`text-sm ${index < 3 ? 'text-black opacity-80' : 'text-gray-400'
                                                }`}>
                                                {player.gamesPlayed} games played
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 text-right">
                                        <div>
                                            <div className={`text-sm ${index < 3 ? 'text-black opacity-80' : 'text-gray-400'
                                                }`}>
                                                Wins
                                            </div>
                                            <div className={`font-bold text-xl ${index < 3 ? 'text-black' : 'text-green-400'
                                                }`}>
                                                {player.gamesWon}
                                            </div>
                                        </div>
                                        <div>
                                            <div className={`text-sm ${index < 3 ? 'text-black opacity-80' : 'text-gray-400'
                                                }`}>
                                                Win Rate
                                            </div>
                                            <div className={`font-bold text-xl ${index < 3 ? 'text-black' : 'text-casino-gold'
                                                }`}>
                                                {player.winRate}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-12">
                            <div className="text-6xl mb-4">🎯</div>
                            <div className="text-xl">No players yet!</div>
                            <div className="text-sm mt-2">Be the first to play and claim the top spot!</div>
                        </div>
                    )}
                </div>

                {/* Footer Stats */}
                {leaderboard.length > 0 && (
                    <div className="mt-6 text-center">
                        <div className="bg-black bg-opacity-30 rounded-lg p-4">
                            <div className="text-casino-gold font-bold text-lg mb-2">
                                🎰 Casino Statistics 🎰
                            </div>
                            <div className="flex justify-center gap-8 text-sm">
                                <div>
                                    <span className="text-gray-400">Total Players: </span>
                                    <span className="text-white font-bold">{leaderboard.length}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Total Games: </span>
                                    <span className="text-white font-bold">
                                        {leaderboard.reduce((sum, player) => sum + player.gamesPlayed, 0)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Total Wins: </span>
                                    <span className="text-green-400 font-bold">
                                        {leaderboard.reduce((sum, player) => sum + player.gamesWon, 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard; 