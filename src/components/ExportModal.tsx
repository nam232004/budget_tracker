import React, { useState, useCallback } from 'react';
import { Transaction } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactions: Transaction[];
}

interface ExportOptions {
    format: 'pdf' | 'excel';
    startDate: string;
    endDate: string;
    includeCategories: boolean;
    includeSummary: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, transactions }) => {
    const { formatCurrency, currency, convertAmount } = useCurrency();
    const [exportOptions, setExportOptions] = useState<ExportOptions>({
        format: 'pdf',
        startDate: '',
        endDate: '',
        includeCategories: true,
        includeSummary: true
    });
    const [isExporting, setIsExporting] = useState(false);

    // Set default dates (current month)
    React.useEffect(() => {
        if (isOpen && !exportOptions.startDate && !exportOptions.endDate) {
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            setExportOptions(prev => ({
                ...prev,
                startDate: firstDay.toISOString().split('T')[0],
                endDate: lastDay.toISOString().split('T')[0]
            }));
        }
    }, [isOpen, exportOptions.startDate, exportOptions.endDate]);

    const getFilteredTransactions = useCallback(() => {
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const start = exportOptions.startDate ? new Date(exportOptions.startDate) : new Date('1900-01-01');
            const end = exportOptions.endDate ? new Date(exportOptions.endDate) : new Date('2100-12-31');

            // Set end date to end of day
            end.setHours(23, 59, 59, 999);

            return transactionDate >= start && transactionDate <= end;
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [transactions, exportOptions.startDate, exportOptions.endDate]);

    const calculateSummary = useCallback((filteredTransactions: Transaction[]) => {
        const income = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + convertAmount(t.amount, t.currency, currency), 0);

        const expenses = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + convertAmount(t.amount, t.currency, currency), 0);

        const categories = filteredTransactions.reduce((acc, t) => {
            const amount = convertAmount(t.amount, t.currency, currency);
            acc[t.category] = (acc[t.category] || 0) + (t.type === 'expense' ? amount : 0);
            return acc;
        }, {} as Record<string, number>);

        return { income, expenses, balance: income - expenses, categories };
    }, [convertAmount, currency]);

    const exportToPDF = useCallback(() => {
        const filteredTransactions = getFilteredTransactions();
        const summary = calculateSummary(filteredTransactions);

        const pdf = new jsPDF();

        // Title
        pdf.setFontSize(20);
        pdf.text('Transaction Report', 20, 20);

        // Date range
        pdf.setFontSize(12);
        pdf.text(`Period: ${exportOptions.startDate} to ${exportOptions.endDate}`, 20, 35);

        let yPos = 50;

        // Summary section
        if (exportOptions.includeSummary) {
            pdf.setFontSize(14);
            pdf.text('Summary', 20, yPos);
            yPos += 15;

            pdf.setFontSize(10);
            pdf.text(`Total Income: ${formatCurrency(summary.income)}`, 20, yPos);
            yPos += 10;
            pdf.text(`Total Expenses: ${formatCurrency(summary.expenses)}`, 20, yPos);
            yPos += 10;
            pdf.text(`Net Balance: ${formatCurrency(summary.balance)}`, 20, yPos);
            yPos += 20;
        }

        // Categories breakdown
        if (exportOptions.includeCategories && Object.keys(summary.categories).length > 0) {
            pdf.setFontSize(14);
            pdf.text('Expenses by Category', 20, yPos);
            yPos += 15;

            const categoryData = Object.entries(summary.categories)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => [category, formatCurrency(amount)]);

            autoTable(pdf, {
                head: [['Category', 'Amount']],
                body: categoryData,
                startY: yPos,
                margin: { left: 20 },
            });

            yPos = (pdf as any).lastAutoTable.finalY + 20;
        }

        // Transactions table
        pdf.setFontSize(14);
        pdf.text('Transactions', 20, yPos);

        const tableData = filteredTransactions.map(transaction => [
            new Date(transaction.date).toLocaleDateString(),
            transaction.description,
            transaction.category,
            transaction.type === 'income' ? 'Income' : 'Expense',
            formatCurrency(convertAmount(transaction.amount, transaction.currency, currency))
        ]);

        autoTable(pdf, {
            head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
            body: tableData,
            startY: yPos + 10,
            margin: { left: 20 },
        });

        // Save the PDF
        const filename = `transactions_${exportOptions.startDate}_${exportOptions.endDate}.pdf`;
        pdf.save(filename);
    }, [getFilteredTransactions, calculateSummary, exportOptions, formatCurrency, convertAmount, currency]);

    const exportToExcel = useCallback(() => {
        const filteredTransactions = getFilteredTransactions();
        const summary = calculateSummary(filteredTransactions);

        // Create workbook
        const wb = XLSX.utils.book_new();

        // Transactions sheet
        const transactionData = filteredTransactions.map(transaction => ({
            Date: new Date(transaction.date).toLocaleDateString(),
            Description: transaction.description,
            Category: transaction.category,
            Type: transaction.type === 'income' ? 'Income' : 'Expense',
            Amount: convertAmount(transaction.amount, transaction.currency, currency),
            'Original Amount': transaction.amount,
            'Original Currency': transaction.currency
        }));

        const transactionSheet = XLSX.utils.json_to_sheet(transactionData);
        XLSX.utils.book_append_sheet(wb, transactionSheet, 'Transactions');

        // Summary sheet
        if (exportOptions.includeSummary) {
            const summaryData = [
                { Metric: 'Total Income', Value: summary.income },
                { Metric: 'Total Expenses', Value: summary.expenses },
                { Metric: 'Net Balance', Value: summary.balance },
                { Metric: 'Total Transactions', Value: filteredTransactions.length }
            ];

            const summarySheet = XLSX.utils.json_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
        }

        // Categories sheet
        if (exportOptions.includeCategories && Object.keys(summary.categories).length > 0) {
            const categoryData = Object.entries(summary.categories)
                .map(([category, amount]) => ({ Category: category, Amount: amount }));

            const categorySheet = XLSX.utils.json_to_sheet(categoryData);
            XLSX.utils.book_append_sheet(wb, categorySheet, 'Categories');
        }

        // Save the file
        const filename = `transactions_${exportOptions.startDate}_${exportOptions.endDate}.xlsx`;
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(blob, filename);
    }, [getFilteredTransactions, calculateSummary, exportOptions, convertAmount, currency]);

    const handleExport = useCallback(async () => {
        setIsExporting(true);
        try {
            if (exportOptions.format === 'pdf') {
                exportToPDF();
            } else {
                exportToExcel();
            }
            onClose();
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        } finally {
            setIsExporting(false);
        }
    }, [exportOptions.format, exportToPDF, exportToExcel, onClose]);

    const handleOptionChange = (key: keyof ExportOptions, value: any) => {
        setExportOptions(prev => ({ ...prev, [key]: value }));
    };

    if (!isOpen) return null;

    const filteredCount = getFilteredTransactions().length;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                    Export Transactions
                                </h3>
                                <div className="mt-4 space-y-4">
                                    {/* Format Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Export Format
                                        </label>
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    value="pdf"
                                                    checked={exportOptions.format === 'pdf'}
                                                    onChange={(e) => handleOptionChange('format', e.target.value)}
                                                    className="form-radio text-primary-600"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">PDF</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    value="excel"
                                                    checked={exportOptions.format === 'excel'}
                                                    onChange={(e) => handleOptionChange('format', e.target.value)}
                                                    className="form-radio text-primary-600"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Excel</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Date Range */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                From Date
                                            </label>
                                            <input
                                                type="date"
                                                value={exportOptions.startDate}
                                                onChange={(e) => handleOptionChange('startDate', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                To Date
                                            </label>
                                            <input
                                                type="date"
                                                value={exportOptions.endDate}
                                                onChange={(e) => handleOptionChange('endDate', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Options */}
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={exportOptions.includeSummary}
                                                onChange={(e) => handleOptionChange('includeSummary', e.target.checked)}
                                                className="form-checkbox text-primary-600"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include Summary</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={exportOptions.includeCategories}
                                                onChange={(e) => handleOptionChange('includeCategories', e.target.checked)}
                                                className="form-checkbox text-primary-600"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include Category Breakdown</span>
                                        </label>
                                    </div>

                                    {/* Preview Info */}
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">{filteredCount}</span> transactions will be exported
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={handleExport}
                            disabled={isExporting || filteredCount === 0}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isExporting ? 'Exporting...' : 'Export'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportModal; 