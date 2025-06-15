import React from 'react';

interface GameControlsProps {
    onHit: () => void;
    onStand: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onHit, onStand }) => {
    return (
        <div className="bg-black bg-opacity-70 rounded-2xl p-6 shadow-2xl border-2 border-casino-gold">
            <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-casino-gold drop-shadow-lg">
                    🎮 YOUR MOVE 🎮
                </h3>
                <div className="w-24 h-1 bg-casino-gold mx-auto rounded-full mt-2"></div>
            </div>

            <div className="flex justify-center gap-6">
                <button
                    onClick={onHit}
                    className="group relative bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-4 px-8 rounded-full hover:from-green-500 hover:to-green-400 transition-all duration-300 transform hover:scale-110 shadow-lg border-2 border-green-700 hover:shadow-2xl"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🃏</span>
                        <span className="text-lg">HIT</span>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>

                <button
                    onClick={onStand}
                    className="group relative bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-4 px-8 rounded-full hover:from-red-500 hover:to-red-400 transition-all duration-300 transform hover:scale-110 shadow-lg border-2 border-red-700 hover:shadow-2xl"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">✋</span>
                        <span className="text-lg">STAND</span>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-red-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>
            </div>

            <div className="text-center mt-4">
                <p className="text-white text-sm opacity-80">
                    Choose wisely! 🎯
                </p>
            </div>
        </div>
    );
};

export default GameControls; 