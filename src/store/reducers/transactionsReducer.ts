import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    Transaction,
    TransactionType,
    TransactionsState
} from '../../types';

// Helper functions
// Load transactions from localStorage if available
const loadTransactions = (): Transaction[] => {
    try {
        const savedTransactions = localStorage.getItem('transactions');
        return savedTransactions ? JSON.parse(savedTransactions) : [];
    } catch (error) {
        console.error('Error loading transactions from localStorage:', error);
        return [];
    }
};

// Save transactions to localStorage
const saveTransactions = (transactions: Transaction[]) => {
    try {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
        console.error('Error saving transactions to localStorage:', error);
    }
};

// Helper function to apply filters
const applyFilters = (
    transactions: Transaction[],
    filter: TransactionsState['filter']
) => {
    return transactions.filter((transaction) => {
        // Type filter
        if (filter.type !== 'all' && transaction.type !== filter.type) {
            return false;
        }

        // Date range filter
        if (filter.startDate) {
            const transactionDate = new Date(transaction.date);
            const startDate = new Date(filter.startDate);
            if (transactionDate < startDate) {
                return false;
            }
        }

        if (filter.endDate) {
            const transactionDate = new Date(transaction.date);
            const endDate = new Date(filter.endDate);
            // Set end date to end of day
            endDate.setHours(23, 59, 59, 999);
            if (transactionDate > endDate) {
                return false;
            }
        }

        return true;
    });
};

// Initial state
const initialState: TransactionsState = {
    transactions: loadTransactions(),
    filteredTransactions: loadTransactions(),
    filter: {
        startDate: null,
        endDate: null,
        type: 'all',
    },
};

// Create slice using Redux Toolkit
const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        addTransaction: (state, action: PayloadAction<Transaction>) => {
            state.transactions.push(action.payload);
            saveTransactions(state.transactions);
            state.filteredTransactions = applyFilters(state.transactions, state.filter);
        },

        deleteTransaction: (state, action: PayloadAction<string>) => {
            state.transactions = state.transactions.filter(
                transaction => transaction.id !== action.payload
            );
            saveTransactions(state.transactions);
            state.filteredTransactions = applyFilters(state.transactions, state.filter);
        },

        editTransaction: (state, action: PayloadAction<Transaction>) => {
            const index = state.transactions.findIndex(
                transaction => transaction.id === action.payload.id
            );
            if (index !== -1) {
                state.transactions[index] = action.payload;
                saveTransactions(state.transactions);
                state.filteredTransactions = applyFilters(state.transactions, state.filter);
            }
        },

        setFilter: (state, action: PayloadAction<{
            startDate?: string | null;
            endDate?: string | null;
            type?: TransactionType | 'all';
        }>) => {
            state.filter = {
                ...state.filter,
                ...action.payload
            };
            state.filteredTransactions = applyFilters(state.transactions, state.filter);
        },

        clearFilters: (state) => {
            state.filter = {
                startDate: null,
                endDate: null,
                type: 'all',
            };
            state.filteredTransactions = [...state.transactions];
        },
    },
});

// Export actions
export const {
    addTransaction,
    deleteTransaction,
    editTransaction,
    setFilter,
    clearFilters
} = transactionsSlice.actions;

// Export reducer
export default transactionsSlice.reducer; 