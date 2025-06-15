import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../types/game';

const Leaderboard: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get<User[]>(
                    `${process.env.REACT_APP_API_URL}/api/leaderboard`
                );
                setLeaderboard(response.data);
            } catch (err) {
                setError('Failed to fetch leaderboard');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-casino-green flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-casino-green flex items-center justify-center">
                <div className="text-white text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-casino-green p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-center mb-6">Leaderboard</h2>
                    <div className="space-y-4">
                        {leaderboard.map((player, index) => (
                            <div
                                key={player.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-xl font-bold text-casino-gold">
                                        #{index + 1}
                                    </span>
                                    <span className="text-lg font-semibold">{player.username}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-600">
                                        Games: {player.gamesPlayed}
                                    </div>
                                    <div className="text-lg font-bold text-casino-green">
                                        Wins: {player.wins}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard; 