import React from 'react';
import { useGame } from '../context/GameContext';
import Card from './Card';
import BettingPanel from './BettingPanel';
import GameControls from './GameControls';

const Game: React.FC = () => {
    const { state, startGame, hit, stand, placeBet, resetGame } = useGame();

    React.useEffect(() => {
        if (state.gameStatus === 'playing' && state.bet > 0) {
            startGame();
        }
    }, [state.bet, state.gameStatus]);

    return (
        <div className="h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-2 overflow-hidden flex flex-col">
            {/* Casino Header - Very Compact */}
            <div className="text-center py-2">
                <h1 className="text-xl md:text-2xl font-bold text-casino-gold mb-1 drop-shadow-lg">
                    🎰 BLACKJACK TABLE 🎰
                </h1>
                <div className="flex justify-center items-center gap-3 md:gap-4 text-casino-gold">
                    <div className="bg-black bg-opacity-50 px-2 py-1 rounded border border-casino-gold">
                        <span className="text-xs">Balance</span>
                        <div className="text-lg md:text-xl font-bold">${state.balance}</div>
                    </div>
                    <div className="bg-black bg-opacity-50 px-2 py-1 rounded border border-casino-gold">
                        <span className="text-xs">Current Bet</span>
                        <div className="text-lg md:text-xl font-bold">${state.bet}</div>
                    </div>
                </div>
            </div>

            {/* Game Table - Takes remaining space */}
            <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col min-h-0">
                <div className="bg-gradient-to-br from-green-700 to-green-800 rounded-xl p-3 md:p-4 shadow-2xl border-2 border-casino-gold relative overflow-hidden flex-1 flex flex-col min-h-0">
                    {/* Table Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform rotate-45"></div>
                    </div>

                    {/* Game Status Message - Minimal */}
                    <div className="text-center mb-2 relative z-10">
                        <div className="bg-black bg-opacity-70 inline-block px-3 py-1 rounded-full border border-casino-gold">
                            <p className="text-sm font-bold text-casino-gold">{state.message}</p>
                        </div>
                    </div>

                    {/* Main Game Area - Compact Grid */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10 min-h-0">
                        {/* Dealer Section */}
                        <div className="flex flex-col justify-center min-h-0">
                            <div className="text-center mb-2">
                                <h3 className="text-base md:text-lg font-bold text-white mb-1 drop-shadow-lg">
                                    🎩 DEALER 🎩
                                </h3>
                                <div className="w-16 h-0.5 bg-casino-gold mx-auto rounded-full"></div>
                            </div>

                            <div className="flex justify-center gap-1 md:gap-2 mb-2 flex-wrap">
                                {state.dealer.hand.map((card, index) => (
                                    <Card
                                        key={`${card.suit}-${card.face}-${index}`}
                                        card={card}
                                        hidden={index === 1 && state.gameStatus === 'playing'}
                                    />
                                ))}
                            </div>

                            {state.gameStatus !== 'playing' && (
                                <div className="text-center">
                                    <div className="bg-black bg-opacity-50 inline-block px-2 py-1 rounded border border-white">
                                        <p className="text-sm font-bold text-white">Score: {state.dealer.score}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Player Section */}
                        <div className="flex flex-col justify-center min-h-0">
                            <div className="text-center mb-2">
                                <h3 className="text-base md:text-lg font-bold text-white mb-1 drop-shadow-lg">
                                    🎲 YOUR HAND 🎲
                                </h3>
                                <div className="w-16 h-0.5 bg-casino-gold mx-auto rounded-full"></div>
                            </div>

                            <div className="flex justify-center gap-1 md:gap-2 mb-2 flex-wrap">
                                {state.player.hand.map((card, index) => (
                                    <Card
                                        key={`${card.suit}-${card.face}-${index}`}
                                        card={card}
                                        hidden={false}
                                    />
                                ))}
                            </div>

                            <div className="text-center">
                                <div className="bg-black bg-opacity-50 inline-block px-2 py-1 rounded border border-casino-gold">
                                    <p className="text-sm font-bold text-casino-gold">Score: {state.player.score}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Game Controls - Compact at bottom */}
                    <div className="text-center mt-2 relative z-10">
                        {state.gameStatus === 'betting' ? (
                            <BettingPanel
                                balance={state.balance}
                                onPlaceBet={placeBet}
                            />
                        ) : state.gameStatus === 'playing' ? (
                            <GameControls onHit={hit} onStand={stand} />
                        ) : (
                            <div className="space-y-2">
                                <div className="text-lg md:text-xl font-bold text-casino-gold">
                                    {state.message.includes('win') || state.message.includes('Win') ? '🎉' :
                                        state.message.includes('lose') || state.message.includes('Lose') ? '😔' : '🤝'}
                                </div>
                                <button
                                    onClick={resetGame}
                                    className="bg-gradient-to-r from-casino-gold to-yellow-400 text-black font-bold py-2 px-4 rounded-full hover:from-yellow-400 hover:to-casino-gold transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-yellow-600"
                                >
                                    🎰 PLAY AGAIN 🎰
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game; 