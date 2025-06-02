import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Transaction } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';

const Dashboard: React.FC = () => {
    const { transactions } = useSelector((state: RootState) => state.transactions);
    const { formatCurrency, currency, convertAmount } = useCurrency();

    // Helper function to convert transaction amount to current currency
    const getConvertedAmount = (transaction: Transaction): number => {
        return convertAmount(transaction.amount, transaction.currency, currency);
    };

    // Calculate total income
    const totalIncome = transactions
        .filter((transaction: Transaction) => transaction.type === 'income')
        .reduce((sum: number, transaction: Transaction) => sum + getConvertedAmount(transaction), 0);

    // Calculate total expenses
    const totalExpenses = transactions
        .filter((transaction: Transaction) => transaction.type === 'expense')
        .reduce((sum: number, transaction: Transaction) => sum + getConvertedAmount(transaction), 0);

    // Calculate balance
    const balance = totalIncome - totalExpenses;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`rounded-lg shadow-lg p-6 transition-colors duration-200 ${balance >= 0
                    ? 'bg-primary-100 dark:bg-primary-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">Current Balance</h2>
                <p className={`text-3xl font-bold ${balance >= 0
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                    {formatCurrency(balance)}
                </p>
            </div>

            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-lg shadow-lg p-6 transition-colors duration-200">
                <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">Total Income</h2>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(totalIncome)}
                </p>
            </div>

            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg shadow-lg p-6 transition-colors duration-200">
                <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">Total Expenses</h2>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(totalExpenses)}
                </p>
            </div>
        </div>
    );
};

export default Dashboard; 