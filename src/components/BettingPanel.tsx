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
        <div className="bg-black bg-opacity-70 rounded-xl p-3 md:p-4 shadow-xl border border-casino-gold">
            <div className="text-center mb-3">
                <h3 className="text-lg font-bold text-casino-gold mb-1 drop-shadow-lg">
                    🎯 PLACE YOUR BET 🎯
                </h3>
                <div className="w-16 h-0.5 bg-casino-gold mx-auto rounded-full"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 items-center justify-center">
                {/* Custom Bet Input - Compact */}
                <div className="flex items-center gap-2">
                    <label className="text-white text-xs font-bold whitespace-nowrap">
                        Custom Bet:
                    </label>
                    <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-casino-gold font-bold text-sm">$</span>
                        <input
                            type="number"
                            value={betAmount}
                            onChange={handleBetChange}
                            className="w-20 pl-6 pr-2 py-1 bg-gray-900 border border-casino-gold rounded focus:outline-none focus:ring-1 focus:ring-yellow-400 text-white font-bold text-center text-sm"
                            min="1"
                            max={balance}
                        />
                    </div>
                    <button
                        onClick={() => onPlaceBet(betAmount)}
                        disabled={betAmount <= 0 || betAmount > balance}
                        className="bg-gradient-to-r from-casino-gold to-yellow-400 text-black font-bold py-1 px-3 rounded-full hover:from-yellow-400 hover:to-casino-gold transition-all duration-300 transform hover:scale-105 shadow-lg border border-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                    >
                        🎲 BET 🎲
                    </button>
                </div>

                {/* Poker Chip Quick Bets - Compact */}
                <div className="flex items-center gap-2">
                    <label className="text-white text-xs font-bold whitespace-nowrap hidden lg:block">
                        Quick Bet:
                    </label>
                    <div className="flex gap-1">
                        {chipButtons.map((chip) => (
                            <button
                                key={chip.value}
                                onClick={() => handleQuickBet(chip.value)}
                                disabled={chip.value > balance}
                                className={`w-10 h-10 ${chip.color} text-white font-bold rounded-full hover:scale-110 transition-all duration-200 shadow-lg border-2 flex items-center justify-center text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden`}
                            >
                                {/* Chip pattern */}
                                <div className="absolute inset-1 border border-white border-opacity-30 rounded-full"></div>
                                <span className="relative z-10 drop-shadow-sm">{chip.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Balance Warning - Compact */}
            {balance < 50 && (
                <div className="text-center mt-2 p-2 bg-red-900 bg-opacity-50 rounded border border-red-500">
                    <p className="text-red-300 text-xs">
                        ⚠️ Low balance! Consider smaller bets.
                    </p>
                </div>
            )}
        </div>
    );
};

export default BettingPanel; 