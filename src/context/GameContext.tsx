import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import axios from 'axios';
import { GameState, Card, Player } from '../types/game';
import { useAuth } from './AuthContext';

interface GameContextType {
    state: GameState;
    startGame: () => void;
    hit: () => void;
    stand: () => void;
    placeBet: (amount: number) => void;
    resetGame: () => void;
    buyBalance: (amount: number) => void;
}

const initialState: GameState = {
    deck: [],
    player: {
        id: 'player',
        username: 'Player',
        hand: [],
        score: 0,
        isDealer: false,
    },
    dealer: {
        id: 'dealer',
        username: 'Dealer',
        hand: [],
        score: 0,
        isDealer: true,
    },
    gameStatus: 'betting',
    message: 'Place your bet to start the game',
    bet: 0,
    balance: 100, // Default fallback, will be updated from user data
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const createDeck = (): Card[] => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
    const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const faces = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck: Card[] = [];

    for (const suit of suits) {
        for (let i = 0; i < values.length; i++) {
            deck.push({
                suit,
                value: values[i],
                face: faces[i],
            });
        }
    }

    return shuffleDeck(deck);
};

const shuffleDeck = (deck: Card[]): Card[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const calculateScore = (hand: Card[]): number => {
    let score = 0;
    let aces = 0;

    for (const card of hand) {
        if (card.value === 14) {
            aces += 1;
        } else {
            score += Math.min(card.value, 10);
        }
    }

    for (let i = 0; i < aces; i++) {
        if (score + 11 <= 21) {
            score += 11;
        } else {
            score += 1;
        }
    }

    return score;
};

type GameAction =
    | { type: 'START_GAME' }
    | { type: 'HIT' }
    | { type: 'STAND' }
    | { type: 'PLACE_BET'; payload: number }
    | { type: 'RESET_GAME' }
    | { type: 'UPDATE_BALANCE'; payload: number }
    | { type: 'GAME_RESULT'; payload: { result: 'win' | 'loss' | 'push'; newBalance: number } };

const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'UPDATE_BALANCE': {
            return {
                ...state,
                balance: action.payload,
            };
        }

        case 'GAME_RESULT': {
            console.log('GameReducer: GAME_RESULT action', {
                result: action.payload.result,
                newBalance: action.payload.newBalance,
                currentBalance: state.balance
            });
            return {
                ...state,
                gameStatus: 'finished',
                balance: action.payload.newBalance,
                message: action.payload.result === 'win' ? 'You win!' :
                    action.payload.result === 'loss' ? 'You lose!' : 'Push!',
            };
        }

        case 'START_GAME': {
            const deck = createDeck();
            const playerHand = [deck.pop()!, deck.pop()!];
            const dealerHand = [deck.pop()!, deck.pop()!];

            return {
                ...state,
                deck,
                player: {
                    ...state.player,
                    hand: playerHand,
                    score: calculateScore(playerHand),
                },
                dealer: {
                    ...state.dealer,
                    hand: dealerHand,
                    score: calculateScore(dealerHand),
                },
                gameStatus: 'playing',
                message: 'Your turn',
            };
        }

        case 'HIT': {
            if (state.gameStatus !== 'playing') return state;

            const newDeck = [...state.deck];
            const newCard = newDeck.pop()!;
            const newHand = [...state.player.hand, newCard];
            const newScore = calculateScore(newHand);

            if (newScore > 21) {
                // Player busts, go to dealer-turn to handle result
                return {
                    ...state,
                    deck: newDeck,
                    player: {
                        ...state.player,
                        hand: newHand,
                        score: newScore,
                    },
                    gameStatus: 'dealer-turn',
                    message: 'Calculating result...',
                };
            }

            return {
                ...state,
                deck: newDeck,
                player: {
                    ...state.player,
                    hand: newHand,
                    score: newScore,
                },
            };
        }

        case 'STAND': {
            if (state.gameStatus !== 'playing') return state;

            let newDeck = [...state.deck];
            let dealerHand = [...state.dealer.hand];
            let dealerScore = state.dealer.score;

            while (dealerScore < 17) {
                const newCard = newDeck.pop()!;
                dealerHand.push(newCard);
                dealerScore = calculateScore(dealerHand);
            }

            // Don't determine winner here, let the backend handle it
            return {
                ...state,
                deck: newDeck,
                dealer: {
                    ...state.dealer,
                    hand: dealerHand,
                    score: dealerScore,
                },
                gameStatus: 'dealer-turn',
                message: 'Calculating result...',
            };
        }

        case 'PLACE_BET': {
            if (state.gameStatus !== 'betting') return state;
            if (action.payload > state.balance) return state;

            return {
                ...state,
                bet: action.payload,
                gameStatus: 'playing',
            };
        }

        case 'RESET_GAME': {
            return {
                ...initialState,
                balance: state.balance, // Keep the current balance
            };
        }

        default:
            return state;
    }
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const { user, token, updateUserBalance, updateUserStats } = useAuth();

    // Sync balance from user data when user changes (but not during active games)
    React.useEffect(() => {
        if (user && user.balance !== undefined && state.gameStatus === 'betting') {
            console.log('GameContext: Syncing balance from user', {
                userBalance: user.balance,
                currentGameBalance: state.balance,
                gameStatus: state.gameStatus
            });
            dispatch({ type: 'UPDATE_BALANCE', payload: user.balance });
        }
    }, [user, state.gameStatus]);

    // Handle game result when dealer turn is finished
    React.useEffect(() => {
        console.log('GameContext: Game status changed to', state.gameStatus);
        if (state.gameStatus === 'dealer-turn') {
            console.log('GameContext: Triggering handleGameResult');
            handleGameResult();
        }
    }, [state.gameStatus]);

    const handleGameResult = async () => {
        if (!token || !user) {
            console.log('handleGameResult: Missing token or user', { token: !!token, user: !!user });
            return;
        }

        console.log('handleGameResult: Starting game result calculation', {
            playerScore: state.player.score,
            dealerScore: state.dealer.score,
            bet: state.bet,
            currentBalance: state.balance
        });

        try {
            const playerScore = state.player.score;
            const dealerScore = state.dealer.score;
            let result: 'win' | 'loss' | 'push';

            // Determine result
            if (playerScore > 21) {
                result = 'loss';
            } else if (dealerScore > 21) {
                result = 'win';
            } else if (dealerScore > playerScore) {
                result = 'loss';
            } else if (dealerScore < playerScore) {
                result = 'win';
            } else {
                result = 'push';
            }

            console.log('handleGameResult: Game result determined', { result });

            // Send result to backend
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/games/result`,
                {
                    result,
                    bet: state.bet,
                    playerScore,
                    dealerScore,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('handleGameResult: Backend response received', response.data);

            // Update local state with new balance from backend
            dispatch({
                type: 'GAME_RESULT',
                payload: {
                    result,
                    newBalance: response.data.newBalance,
                },
            });

            // Update user balance and stats in AuthContext
            updateUserBalance(response.data.newBalance);
            updateUserStats(response.data.wins, response.data.gamesPlayed);

            console.log('handleGameResult: Updated balance and stats', {
                newBalance: response.data.newBalance,
                wins: response.data.wins,
                gamesPlayed: response.data.gamesPlayed
            });

        } catch (error) {
            console.error('handleGameResult: Failed to record game result:', error);
            // Fallback to local calculation if backend fails
            const playerScore = state.player.score;
            const dealerScore = state.dealer.score;
            let result: 'win' | 'loss' | 'push';
            let newBalance = state.balance;

            if (playerScore > 21) {
                result = 'loss';
                newBalance -= state.bet;
            } else if (dealerScore > 21) {
                result = 'win';
                newBalance += state.bet;
            } else if (dealerScore > playerScore) {
                result = 'loss';
                newBalance -= state.bet;
            } else if (dealerScore < playerScore) {
                result = 'win';
                newBalance += state.bet;
            } else {
                result = 'push';
            }

            console.log('handleGameResult: Using fallback calculation', {
                result,
                oldBalance: state.balance,
                newBalance: Math.max(0, newBalance)
            });

            dispatch({
                type: 'GAME_RESULT',
                payload: {
                    result,
                    newBalance: Math.max(0, newBalance), // Don't allow negative balance
                },
            });
        }
    };

    const buyBalance = async (amount: number) => {
        if (!token) return;

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/user/purchase-balance`,
                { amount },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            dispatch({ type: 'UPDATE_BALANCE', payload: response.data.newBalance });

            // Update user balance in AuthContext
            updateUserBalance(response.data.newBalance);
        } catch (error) {
            console.error('Failed to buy balance:', error);
            throw new Error('Failed to purchase balance');
        }
    };

    const startGame = () => dispatch({ type: 'START_GAME' });
    const hit = () => dispatch({ type: 'HIT' });
    const stand = () => dispatch({ type: 'STAND' });
    const placeBet = (amount: number) => dispatch({ type: 'PLACE_BET', payload: amount });
    const resetGame = () => dispatch({ type: 'RESET_GAME' });

    return (
        <GameContext.Provider
            value={{
                state,
                startGame,
                hit,
                stand,
                placeBet,
                resetGame,
                buyBalance,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}; 