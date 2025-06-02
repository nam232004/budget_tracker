import React from 'react';
import { ViewMode } from '../hooks/useViewMode';

interface TransactionControlsProps {
    viewMode: ViewMode;
    onToggleView: () => void;
    onExportClick: () => void;
}

const TransactionControls: React.FC<TransactionControlsProps> = ({
    viewMode,
    onToggleView,
    onExportClick
}) => {
    return (
        <div className="flex flex-wrap gap-2">
            {/* View Toggle Button */}
            <button
                type="button"
                onClick={onToggleView}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                title={`Switch to ${viewMode === 'list' ? 'chart' : 'list'} view`}
            >
                <div className="flex items-center space-x-2">
                    {viewMode === 'list' ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span>Chart View</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            <span>List View</span>
                        </>
                    )}
                </div>
            </button>

            {/* Export Button */}
            <button
                type="button"
                onClick={onExportClick}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Export transactions"
            >
                <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <span>Export</span>
                </div>
            </button>
        </div>
    );
};

export default TransactionControls; 