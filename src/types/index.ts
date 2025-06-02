export type TransactionType = 'income' | 'expense';
export type Currency = 'USD' | 'VND';

export interface Transaction {
    id: string;
    amount: number;
    description: string;
    type: TransactionType;
    category: string;
    date: string;
    currency: Currency; // Currency in which the transaction was originally recorded
}

export interface TransactionsState {
    transactions: Transaction[];
    filteredTransactions: Transaction[];
    filter: {
        startDate: string | null;
        endDate: string | null;
        type: TransactionType | 'all';
    };
} 