import React from 'react';
import Header from '../components/Header';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Dashboard from '../components/Dashboard';
import FilterPanel from '../components/FilterPanel';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <Dashboard />

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add Transaction</h2>
                        <TransactionForm />
                    </div>

                    <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transactions</h2>
                            <FilterPanel />
                        </div>
                        <TransactionList />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;