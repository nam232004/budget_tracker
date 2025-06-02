import React from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { editTransaction } from '../store/reducers/transactionsReducer';
import { Transaction, TransactionType } from '../types';
import { AppDispatch } from '../store';
import { useCurrency } from '../contexts/CurrencyContext';

const categories = {
    income: ['Salary', 'Freelance', 'Gift', 'Other'],
    expense: ['Food', 'Housing', 'Transportation', 'Entertainment', 'Healthcare', 'Shopping', 'Other']
};

// Validation schema
const validationSchema = Yup.object({
    description: Yup.string()
        .required('Description is required')
        .min(3, 'Description must be at least 3 characters')
        .max(100, 'Description must be less than 100 characters'),
    amount: Yup.number()
        .required('Amount is required')
        .positive('Amount must be positive')
        .min(0.01, 'Amount must be at least 0.01'),
    type: Yup.string()
        .oneOf(['income', 'expense'], 'Invalid transaction type')
        .required('Transaction type is required'),
    category: Yup.string()
        .required('Category is required'),
    date: Yup.date()
        .required('Date is required')
        .max(new Date(), 'Date cannot be in the future')
});

interface FormValues {
    description: string;
    amount: string;
    type: TransactionType;
    category: string;
    date: string;
}

interface EditTransactionModalProps {
    transaction: Transaction;
    isOpen: boolean;
    onClose: () => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
    transaction,
    isOpen,
    onClose
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { currencySymbol } = useCurrency();

    const initialValues: FormValues = {
        description: transaction.description,
        amount: transaction.amount.toString(),
        type: transaction.type,
        category: transaction.category,
        date: transaction.date
    };

    const handleSubmit = (values: FormValues) => {
        const updatedTransaction: Transaction = {
            ...transaction,
            description: values.description,
            amount: parseFloat(values.amount),
            type: values.type,
            category: values.category,
            date: values.date,
        };

        dispatch(editTransaction(updatedTransaction));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Edit Transaction
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label="Close modal"
                        title="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue }) => (
                        <Form className="space-y-4">
                            {/* Description Field */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <Field
                                    type="text"
                                    id="description"
                                    name="description"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                                    placeholder="Enter transaction description"
                                />
                                <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                            </div>

                            {/* Amount Field */}
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Amount ({currencySymbol})
                                </label>
                                <Field
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    step="0.01"
                                    min="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                                    placeholder="0.00"
                                />
                                <ErrorMessage name="amount" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                            </div>

                            {/* Type Field */}
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Type
                                </label>
                                <Field
                                    as="select"
                                    id="type"
                                    name="type"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        const newType = e.target.value as TransactionType;
                                        setFieldValue('type', newType);
                                        setFieldValue('category', categories[newType][0]);
                                    }}
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </Field>
                                <ErrorMessage name="type" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                            </div>

                            {/* Category Field */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Category
                                </label>
                                <Field
                                    as="select"
                                    id="category"
                                    name="category"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                                >
                                    {categories[values.type].map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="category" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                            </div>

                            {/* Date Field */}
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Date
                                </label>
                                <Field
                                    type="date"
                                    id="date"
                                    name="date"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                                />
                                <ErrorMessage name="date" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default EditTransactionModal; 