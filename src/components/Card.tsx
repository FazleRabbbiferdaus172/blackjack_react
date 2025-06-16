import React from 'react';
import { Card as CardType } from '../types/game';

interface CardProps {
    card: CardType;
    hidden: boolean;
}

const Card: React.FC<CardProps> = ({ card, hidden }) => {
    if (hidden) {
        return (
            <div className="w-32 h-44 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl shadow-2xl border-2 border-blue-700 flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
                <div className="w-24 h-36 bg-gradient-to-br from-red-800 to-red-900 rounded-lg flex items-center justify-center">
                    <div className="text-white text-2xl font-bold opacity-80">🂠</div>
                </div>
            </div>
        );
    }

    const getSuitColor = (suit: string) => {
        return suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-black';
    };

    const getSuitSymbol = (suit: string) => {
        switch (suit) {
            case 'hearts':
                return '♥';
            case 'diamonds':
                return '♦';
            case 'clubs':
                return '♣';
            case 'spades':
                return '♠';
            default:
                return '';
        }
    };

    const getCardBackground = (suit: string) => {
        const isRed = suit === 'hearts' || suit === 'diamonds';
        return isRed
            ? 'bg-gradient-to-br from-white to-red-50 border-red-200'
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200';
    };

    return (
        <div className={`w-32 h-44 ${getCardBackground(card.suit)} rounded-xl shadow-2xl border-2 p-3 relative transform hover:scale-105 transition-all duration-200 hover:shadow-3xl`}>
            {/* Top left corner */}
            <div className={`absolute top-2 left-2 text-center ${getSuitColor(card.suit)}`}>
                <div className="text-lg font-bold leading-none">{card.face}</div>
                <div className="text-xl leading-none">{getSuitSymbol(card.suit)}</div>
            </div>

            {/* Center symbol */}
            <div className={`absolute inset-0 flex items-center justify-center ${getSuitColor(card.suit)}`}>
                <div className="text-4xl opacity-80">{getSuitSymbol(card.suit)}</div>
            </div>

            {/* Bottom right corner (rotated) */}
            <div className={`absolute bottom-2 right-2 text-center transform rotate-180 ${getSuitColor(card.suit)}`}>
                <div className="text-lg font-bold leading-none">{card.face}</div>
                <div className="text-xl leading-none">{getSuitSymbol(card.suit)}</div>
            </div>

            {/* Card shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-20 rounded-xl"></div>
        </div>
    );
};

export default Card; 