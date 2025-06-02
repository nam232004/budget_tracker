import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilters } from '../store/reducers/transactionsReducer';
import { RootState, AppDispatch } from '../store';
import { TransactionType } from '../types';

const FilterPanel: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { filter } = useSelector((state: RootState) => state.transactions);
    const [isOpen, setIsOpen] = useState(false);

    const [localFilter, setLocalFilter] = useState({
        startDate: filter.startDate || '',
        endDate: filter.endDate || '',
        type: filter.type || 'all'
    });

    const toggleFilterPanel = () => {
        setIsOpen(!isOpen);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalFilter({
            ...localFilter,
            [name]: value
        });
    };

    const applyFilter = () => {
        dispatch(setFilter({
            startDate: localFilter.startDate || null,
            endDate: localFilter.endDate || null,
            type: localFilter.type as TransactionType | 'all'
        }));
        setIsOpen(false);
    };

    const resetFilter = () => {
        dispatch(clearFilters());
        setLocalFilter({
            startDate: '',
            endDate: '',
            type: 'all'
        });
        setIsOpen(false);
    };

    const isFilterActive = filter.startDate || filter.endDate || filter.type !== 'all';

    return (
        <div className="relative">
            <button
                type="button"
                onClick={toggleFilterPanel}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 ${isFilterActive
                    ? 'bg-primary-100 text-primary-700 border-primary-300 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                    }`}
            >
                <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                    </svg>
                    <span>{isFilterActive ? 'Filters Active' : 'Filter'}</span>
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Transaction Type
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={localFilter.type}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                            >
                                <option value="all">All</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                From Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={localFilter.startDate}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                            />
                        </div>

                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                To Date
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={localFilter.endDate}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                            />
                        </div>

                        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={resetFilter}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={applyFilter}
                                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterPanel; 