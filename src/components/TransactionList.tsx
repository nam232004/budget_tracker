import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { deleteTransaction } from '../store/reducers/transactionsReducer';
import { Transaction } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import EditTransactionModal from './EditTransactionModal';

const TransactionList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { filteredTransactions } = useSelector((state: RootState) => state.transactions);
    const { formatCurrency, currency, convertAmount } = useCurrency();
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            dispatch(deleteTransaction(id));
        }
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
    };

    const handleCloseModal = () => {
        setEditingTransaction(null);
    };

    // Helper function to convert transaction amount to current currency
    const getConvertedAmount = (transaction: Transaction): number => {
        return convertAmount(transaction.amount, transaction.currency, currency);
    };

    if (filteredTransactions.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredTransactions.map((transaction: Transaction) => {
                            const convertedAmount = getConvertedAmount(transaction);
                            const isOriginalCurrency = transaction.currency === currency;

                            return (
                                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {transaction.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                            {transaction.category}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.type === 'income'
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        <div className="flex flex-col">
                                            <span>
                                                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(convertedAmount)}
                                            </span>
                                            {!isOriginalCurrency && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    Original: {transaction.currency === 'USD' ? '$' : '₫'}{transaction.amount.toFixed(transaction.currency === 'USD' ? 2 : 0)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(transaction)}
                                                className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
                                                title="Edit transaction"
                                                aria-label="Edit transaction"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(transaction.id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                                                title="Delete transaction"
                                                aria-label="Delete transaction"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingTransaction && (
                <EditTransactionModal
                    transaction={editingTransaction}
                    isOpen={!!editingTransaction}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default TransactionList; 