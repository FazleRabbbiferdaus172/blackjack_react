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
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const isAuthenticated = !!token;
    console.log('AuthProvider state:', { isAuthenticated, hasUser: !!user, hasToken: !!token });

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
            console.log('Setting token and user:', { token: token ? 'exists' : 'missing', user });

            setToken(token);
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            console.log('Login completed, isAuthenticated should be:', !!token);
        } catch (error: any) {
            console.error('Login error:', error.response?.data || error.message);
            console.error('Error status:', error.response?.status);
            console.error('Error details:', error.response);
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
            console.error('Error status:', error.response?.status);
            console.error('Error details:', error.response);
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
        if (user) {
            const updatedUser = { ...user, balance: newBalance };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    React.useEffect(() => {
        console.log('AuthProvider useEffect: Loading from localStorage');
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        console.log('Stored data:', {
            hasStoredToken: !!storedToken,
            hasStoredUser: !!storedUser,
            storedToken: storedToken ? 'exists' : 'missing'
        });

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            console.log('Restored auth state from localStorage');
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                register,
                logout,
                updateUserBalance,
                isAuthenticated,
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