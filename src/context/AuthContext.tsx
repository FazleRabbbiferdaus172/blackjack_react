import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { User, AuthResponse } from '../types/game';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => void;
    updateUserBalance: (newBalance: number) => void;
    updateUserStats: (wins: number, gamesPlayed: number) => void;
    updateUserProfile: (username: string) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!token && !!user;

    const login = async (username: string, password: string) => {
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/auth/login`;
            console.log('Logging in user:', { username, url });

            const response = await axios.post<AuthResponse>(
                url,
                { username, password }
            );

            console.log('Login successful:', response.data);
            const { token, user } = response.data;

            setToken(token);
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error: any) {
            console.error('Login error:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || error.response?.statusText || 'Login failed';
            throw new Error(errorMessage);
        }
    };

    const register = async (username: string, password: string) => {
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/auth/register`;
            console.log('Registering user:', { username, url });

            const response = await axios.post<AuthResponse>(
                url,
                { username, password }
            );

            console.log('Registration successful:', response.data);
            const { token, user } = response.data;
            setToken(token);
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error: any) {
            console.error('Registration error:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || error.response?.statusText || 'Registration failed';
            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateUserBalance = (newBalance: number) => {
        console.log('AuthContext: updateUserBalance called', {
            currentBalance: user?.balance,
            newBalance,
            user: user?.username
        });
        if (user) {
            const updatedUser = { ...user, balance: newBalance };
            console.log('AuthContext: About to update user object', {
                oldUser: user,
                newUser: updatedUser
            });
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            console.log('AuthContext: User balance updated', {
                username: updatedUser.username,
                newBalance: updatedUser.balance
            });
        } else {
            console.log('AuthContext: No user found, cannot update balance');
        }
    };

    const updateUserStats = (wins: number, gamesPlayed: number) => {
        console.log('AuthContext: updateUserStats called', {
            currentWins: user?.wins,
            currentGamesPlayed: user?.gamesPlayed,
            currentBalance: user?.balance,
            newWins: wins,
            newGamesPlayed: gamesPlayed
        });
        if (user) {
            // Use the most current user state to preserve any recent balance updates
            setUser(currentUser => {
                if (!currentUser) return null;
                const updatedUser = { ...currentUser, wins: wins, gamesPlayed: gamesPlayed };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                console.log('AuthContext: User stats updated', {
                    username: updatedUser.username,
                    balance: updatedUser.balance,
                    wins: updatedUser.wins,
                    gamesPlayed: updatedUser.gamesPlayed
                });
                return updatedUser;
            });
        }
    };

    const updateUserProfile = (username: string) => {
        if (user) {
            const updatedUser = { ...user, username };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    // Track user object changes
    React.useEffect(() => {
        console.log('AuthContext: User object changed', {
            username: user?.username,
            balance: user?.balance,
            wins: user?.wins,
            gamesPlayed: user?.gamesPlayed
        });
    }, [user]);

    // Initialize authentication state from localStorage
    React.useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedToken = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                console.log('Initializing auth from localStorage:', {
                    hasToken: !!storedToken,
                    hasUser: !!storedUser
                });

                if (storedToken && storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setToken(storedToken);
                    setUser(parsedUser);
                    console.log('Auth restored from localStorage:', parsedUser.username);
                } else {
                    console.log('No stored auth data found');
                }
            } catch (error) {
                console.error('Error loading auth from localStorage:', error);
                // Clear corrupted data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Show loading screen while initializing
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center">
                <div className="text-casino-gold text-xl font-bold">
                    🎰 Loading Casino...
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                register,
                logout,
                updateUserBalance,
                updateUserStats,
                updateUserProfile,
                isAuthenticated,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 