import { useMemo } from 'react';
import { Transaction } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';

export interface ChartDataPoint {
    date: string;
    income: number;
    expense: number;
    balance: number;
    formattedDate: string;
}

export const useChartData = (transactions: Transaction[]) => {
    const { convertAmount, currency } = useCurrency();

    const chartData = useMemo(() => {
        if (!transactions.length) return [];

        // Group transactions by date
        const dateGroups = transactions.reduce((groups, transaction) => {
            const date = transaction.date;
            if (!groups[date]) {
                groups[date] = { income: 0, expense: 0 };
            }

            const convertedAmount = convertAmount(
                transaction.amount,
                transaction.currency,
                currency
            );

            if (transaction.type === 'income') {
                groups[date].income += convertedAmount;
            } else {
                groups[date].expense += convertedAmount;
            }

            return groups;
        }, {} as Record<string, { income: number; expense: number }>);

        // Convert to array and sort by date
        const sortedData = Object.entries(dateGroups)
            .map(([date, data]) => ({
                date,
                income: data.income,
                expense: data.expense,
                balance: data.income - data.expense,
                formattedDate: new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                })
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Calculate running balance
        let runningBalance = 0;
        return sortedData.map(item => {
            runningBalance += item.balance;
            return {
                ...item,
                balance: runningBalance
            };
        });
    }, [transactions, convertAmount, currency]);

    const summary = useMemo(() => {
        const totalIncome = chartData.reduce((sum, item) => sum + item.income, 0);
        const totalExpense = chartData.reduce((sum, item) => sum + item.expense, 0);
        const netBalance = totalIncome - totalExpense;

        return {
            totalIncome,
            totalExpense,
            netBalance,
            transactionCount: transactions.length
        };
    }, [chartData, transactions.length]);

    return {
        chartData,
        summary,
        hasData: chartData.length > 0
    };
}; 