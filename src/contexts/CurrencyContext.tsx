import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = 'USD' | 'VND';

const EXCHANGE_RATE = 25954; 

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatCurrency: (amount: number) => string;
    currencySymbol: string;
    convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
    exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

interface CurrencyProviderProps {
    children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
    const [currency, setCurrency] = useState<Currency>('USD');

    const convertAmount = (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
        if (fromCurrency === toCurrency) {
            return amount;
        }

        if (fromCurrency === 'USD' && toCurrency === 'VND') {
            return amount * EXCHANGE_RATE;
        } else if (fromCurrency === 'VND' && toCurrency === 'USD') {
            return amount / EXCHANGE_RATE;
        }

        return amount;
    };

    const formatCurrency = (amount: number): string => {
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(amount);
        } else {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount);
        }
    };

    const currencySymbol = currency === 'USD' ? '$' : '₫';

    const value = {
        currency,
        setCurrency,
        formatCurrency,
        currencySymbol,
        convertAmount,
        exchangeRate: EXCHANGE_RATE,
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
}; 