import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Card from './Card';
import BettingPanel from './BettingPanel';
import GameControls from './GameControls';

const Game: React.FC = () => {
    const { state, startGame, hit, stand, placeBet, resetGame, buyBalance } = useGame();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Debug logging for balance updates
    React.useEffect(() => {
        console.log('Game component: Balance updated', {
            gameBalance: state.balance,
            userBalance: user?.balance,
            gameStatus: state.gameStatus
        });
    }, [state.balance, user?.balance, state.gameStatus]);

    React.useEffect(() => {
        if (state.gameStatus === 'playing' && state.bet > 0) {
            startGame();
        }
    }, [state.bet, state.gameStatus]);

    const handlePurchaseCredit = async (amount: number) => {
        setIsLoading(true);
        try {
            await buyBalance(amount);
        } catch (error) {
            console.error('Failed to purchase credit:', error);
            alert('Failed to purchase credit. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };



    // Betting/Home Page Layout
    if (state.gameStatus === 'betting') {
        return (
            <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex flex-col">
                {/* Welcome Header */}
                <div className="text-center py-6 px-6">
                    <div className="mb-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-casino-gold mb-2 drop-shadow-lg">
                            Welcome back, {user?.username}! 🎰
                        </h1>
                        <p className="text-lg text-gray-300 mb-4">
                            Ready for another round of Blackjack? Place your bet and let's play!
                        </p>
                        <div className="flex justify-center items-center gap-6 text-casino-gold">
                            <div className="bg-black bg-opacity-50 px-4 py-2 rounded-lg border border-casino-gold">
                                <span className="text-sm text-gray-300 block">Your Balance</span>
                                <div className="text-2xl font-bold">${state.balance}</div>
                            </div>
                            <div className="bg-black bg-opacity-50 px-4 py-2 rounded-lg border border-casino-gold">
                                <span className="text-sm text-gray-300 block">Games Won</span>
                                <div className="text-2xl font-bold text-green-400">{user?.gamesWon}</div>
                            </div>
                            <div className="bg-black bg-opacity-50 px-4 py-2 rounded-lg border border-casino-gold">
                                <span className="text-sm text-gray-300 block">Total Games</span>
                                <div className="text-2xl font-bold">{user?.gamesPlayed}</div>
                            </div>
                        </div>
                    </div>

                    {/* Low Balance Alert & Purchase Credit */}
                    {state.balance < 20 && (
                        <div className="mt-4 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4 max-w-2xl mx-auto">
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-red-300 mb-2">
                                    ⚠️ Low Balance Alert
                                </h3>
                                <p className="text-red-200 mb-4">
                                    Your balance is running low! Purchase more credits to keep playing.
                                </p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <button
                                        onClick={() => handlePurchaseCredit(50)}
                                        disabled={isLoading}
                                        className="bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-2 px-4 rounded-lg hover:from-green-500 hover:to-green-400 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? '...' : '+$50'}
                                    </button>
                                    <button
                                        onClick={() => handlePurchaseCredit(100)}
                                        disabled={isLoading}
                                        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? '...' : '+$100'}
                                    </button>
                                    <button
                                        onClick={() => handlePurchaseCredit(250)}
                                        disabled={isLoading}
                                        className="bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? '...' : '+$250'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 px-6 pb-6">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Centered Betting Section */}
                        <div className="flex items-center justify-center">
                            <div className="bg-black bg-opacity-40 rounded-3xl p-8 shadow-2xl max-w-5xl w-full">
                                <div className="text-center mb-6">
                                    <h2 className="text-3xl md:text-4xl font-bold text-casino-gold mb-3 drop-shadow-lg">
                                        🎯 PLACE YOUR BET 🎯
                                    </h2>
                                    <p className="text-lg text-gray-300">
                                        Choose your bet amount and start playing!
                                    </p>
                                </div>

                                <BettingPanel
                                    balance={state.balance}
                                    onPlaceBet={placeBet}
                                />
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        );
    }

    // Game Playing Layout (existing layout for when game is active)
    return (
        <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex flex-col">
            {/* Top Status Bar */}
            <div className="flex justify-between items-center px-6 py-2 bg-black bg-opacity-30">
                <div className="text-casino-gold">
                    <h1 className="text-xl font-bold">🎰 BLACKJACK</h1>
                </div>
                <div className="flex gap-4">
                    <div className="bg-black bg-opacity-50 px-3 py-1 rounded border border-casino-gold">
                        <span className="text-xs text-gray-300">Balance</span>
                        <div className="text-lg font-bold text-casino-gold">${state.balance}</div>
                    </div>
                    <div className="bg-black bg-opacity-50 px-3 py-1 rounded border border-casino-gold">
                        <span className="text-xs text-gray-300">Bet</span>
                        <div className="text-lg font-bold text-casino-gold">${state.bet}</div>
                    </div>
                </div>
            </div>

            {/* Main Game Area */}
            <div className="flex-1 flex flex-col px-4">
                {/* Game Status */}
                <div className="text-center mb-2 pt-4">
                    <div className="bg-black bg-opacity-70 inline-block px-4 py-1 rounded-full border border-casino-gold">
                        <p className="text-sm font-bold text-casino-gold">{state.message}</p>
                    </div>
                </div>

                {/* Playing Area - Two Columns */}
                <div className="flex-1 grid grid-cols-2 gap-8 content-start">
                    {/* Dealer Section */}
                    <div className="flex flex-col items-center justify-start pt-2">
                        <h3 className="text-lg font-bold text-white mb-3 drop-shadow-lg">
                            🎩 DEALER
                        </h3>

                        <div className="flex gap-2 mb-3 items-center">
                            {state.dealer.hand.length > 0 ? (
                                state.dealer.hand.map((card, index) => (
                                    <Card
                                        key={`${card.suit}-${card.face}-${index}`}
                                        card={card}
                                        hidden={index === 1 && state.gameStatus === 'playing'}
                                    />
                                ))
                            ) : (
                                <div className="text-gray-400 text-sm">No cards dealt</div>
                            )}
                        </div>

                        {state.gameStatus !== 'playing' && state.dealer.hand.length > 0 && (
                            <div className="bg-black bg-opacity-50 px-3 py-1 rounded border border-white">
                                <p className="text-sm font-bold text-white">Score: {state.dealer.score}</p>
                            </div>
                        )}
                    </div>

                    {/* Player Section */}
                    <div className="flex flex-col items-center justify-start pt-2">
                        <h3 className="text-lg font-bold text-white mb-3 drop-shadow-lg">
                            🎲 YOUR HAND
                        </h3>

                        <div className="flex gap-2 mb-3 items-center">
                            {state.player.hand.length > 0 ? (
                                state.player.hand.map((card, index) => (
                                    <Card
                                        key={`${card.suit}-${card.face}-${index}`}
                                        card={card}
                                        hidden={false}
                                    />
                                ))
                            ) : (
                                <div className="text-gray-400 text-sm">No cards dealt</div>
                            )}
                        </div>

                        {state.player.hand.length > 0 && (
                            <div className="bg-black bg-opacity-50 px-3 py-1 rounded border border-casino-gold">
                                <p className="text-sm font-bold text-casino-gold">Score: {state.player.score}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls Area - Stuck to bottom */}
                <div className="flex items-center justify-center py-4 mt-auto mb-2">
                    {state.gameStatus === 'playing' ? (
                        <GameControls onHit={hit} onStand={stand} />
                    ) : (
                        <div className="text-center">
                            <div className="text-xl font-bold text-casino-gold mb-2">
                                {state.message.includes('win') || state.message.includes('Win') ? '🎉' :
                                    state.message.includes('lose') || state.message.includes('Lose') ? '😔' : '🤝'}
                            </div>
                            <button
                                onClick={resetGame}
                                className="bg-gradient-to-r from-casino-gold to-yellow-400 text-black font-bold py-2 px-6 rounded-full hover:from-yellow-400 hover:to-casino-gold transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-yellow-600"
                            >
                                🎰 PLAY AGAIN 🎰
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Game; 