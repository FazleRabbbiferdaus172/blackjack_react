import React, { useState } from 'react';

interface BettingPanelProps {
    balance: number;
    onPlaceBet: (amount: number) => void;
}

const BettingPanel: React.FC<BettingPanelProps> = ({ balance, onPlaceBet }) => {
    const [betAmount, setBetAmount] = useState(10);

    const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 0) {
            setBetAmount(Math.min(value, balance));
        }
    };

    const handleQuickBet = (amount: number) => {
        setBetAmount(Math.min(amount, balance));
    };

    const chipButtons = [
        { value: 5, color: 'bg-red-600 border-red-800', label: '$5' },
        { value: 10, color: 'bg-blue-600 border-blue-800', label: '$10' },
        { value: 25, color: 'bg-green-600 border-green-800', label: '$25' },
        { value: 50, color: 'bg-purple-600 border-purple-800', label: '$50' },
        { value: 100, color: 'bg-yellow-500 border-yellow-700', label: '$100' },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-col gap-4">
                {/* Poker Chips */}
                <div className="flex justify-center gap-2">
                    {chipButtons.map((chip) => (
                        <button
                            key={chip.value}
                            onClick={() => handleQuickBet(chip.value)}
                            disabled={chip.value > balance}
                            className={`w-12 h-12 ${chip.color} text-white font-bold rounded-full hover:scale-110 transition-all duration-200 shadow-lg border-2 flex items-center justify-center text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden`}
                        >
                            <div className="absolute inset-1 border border-white border-opacity-30 rounded-full"></div>
                            <span className="relative z-10 drop-shadow-sm">{chip.label}</span>
                        </button>
                    ))}
                </div>

                {/* Custom Bet Input */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="text-white text-sm font-bold">Custom:</div>
                        <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-casino-gold font-bold text-sm">$</span>
                            <input
                                type="number"
                                value={betAmount}
                                onChange={handleBetChange}
                                className="w-20 pl-6 pr-2 py-2 bg-gray-900 border border-casino-gold rounded focus:outline-none focus:ring-1 focus:ring-yellow-400 text-white font-bold text-center text-sm"
                                min="1"
                                max={balance}
                            />
                        </div>
                    </div>

                    {/* Large Prominent BET Button */}
                    <button
                        onClick={() => onPlaceBet(betAmount)}
                        disabled={betAmount <= 0 || betAmount > balance}
                        className="bg-gradient-to-r from-casino-gold to-yellow-400 text-black font-bold py-4 px-12 text-xl rounded-full hover:from-yellow-400 hover:to-casino-gold transition-all duration-300 transform hover:scale-110 shadow-2xl border-4 border-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[200px]"
                    >
                        🎲 START GAME 🎲
                    </button>
                </div>
            </div>

            {/* Balance Warning */}
            {balance < 50 && (
                <div className="text-center mt-3">
                    <p className="text-red-300 text-xs">
                        ⚠️ Low balance! Consider smaller bets.
                    </p>
                </div>
            )}
        </div>
    );
};

export default BettingPanel; 