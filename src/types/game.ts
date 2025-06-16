export interface Card {
    suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
    value: number;
    face: string;
}

export interface Player {
    id: string;
    username: string;
    hand: Card[];
    score: number;
    isDealer: boolean;
}

export interface GameState {
    deck: Card[];
    player: Player;
    dealer: Player;
    gameStatus: 'betting' | 'playing' | 'dealer-turn' | 'finished';
    message: string;
    bet: number;
    balance: number;
}

export interface User {
    id: string;
    username: string;
    gamesWon: number;
    gamesPlayed: number;
    balance: number;
}

export interface AuthResponse {
    tokens: {
        accessToken: string;
        idToken: string;
        refreshToken: string;
    };
    user: User;
} 