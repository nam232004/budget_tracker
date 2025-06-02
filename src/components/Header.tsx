import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
    const { currency, setCurrency, exchangeRate } = useCurrency();
    const { theme, toggleTheme, isDark } = useTheme();

    return (
        <header className="bg-primary-600 dark:bg-primary-800 text-white shadow-md transition-colors duration-200">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Personal Finance Tracker</h1>
                    <p className="text-sm opacity-90">Keep track of your finances</p>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Exchange Rate Info */}
                    <div className="hidden md:flex items-center text-sm opacity-90">
                        <span>1 USD = {exchangeRate.toLocaleString()} VND</span>
                    </div>

                    {/* Currency Toggle */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Currency:</span>
                        <button
                            onClick={() => setCurrency(currency === 'USD' ? 'VND' : 'USD')}
                            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                        >
                            <span>{currency}</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </button>
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-md transition-colors duration-200"
                        aria-label="Toggle theme"
                    >
                        {isDark ? (
                            // Sun icon for light mode
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            // Moon icon for dark mode
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header; 