import React from 'react';
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useChartData, ChartDataPoint } from '../hooks/useChartData';
import { Transaction } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';

interface TransactionChartProps {
    transactions: Transaction[];
}

const TransactionChart: React.FC<TransactionChartProps> = ({ transactions }) => {
    const { chartData, summary, hasData } = useChartData(transactions);
    const { formatCurrency } = useCurrency();

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">{`Date: ${label}`}</p>
                    {payload.map((item: any, index: number) => (
                        <p key={index} style={{ color: item.color }} className="text-sm">
                            {`${item.name}: ${formatCurrency(item.value)}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (!hasData) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 text-lg">No data to display</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Add some transactions to see the chart</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">Total Income</p>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-100">{formatCurrency(summary.totalIncome)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">Total Expenses</p>
                            <p className="text-2xl font-bold text-red-900 dark:text-red-100">{formatCurrency(summary.totalExpense)}</p>
                        </div>
                    </div>
                </div>

                <div className={`p-4 rounded-lg border ${summary.netBalance >= 0
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                    }`}>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className={`w-8 h-8 ${summary.netBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className={`text-sm font-medium ${summary.netBalance >= 0
                                ? 'text-blue-800 dark:text-blue-200'
                                : 'text-orange-800 dark:text-orange-200'
                                }`}>Net Balance</p>
                            <p className={`text-2xl font-bold ${summary.netBalance >= 0
                                ? 'text-blue-900 dark:text-blue-100'
                                : 'text-orange-900 dark:text-orange-100'
                                }`}>{formatCurrency(summary.netBalance)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Transactions</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{summary.transactionCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Overview</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis
                            dataKey="formattedDate"
                            className="text-gray-600 dark:text-gray-400"
                            fontSize={12}
                        />
                        <YAxis
                            className="text-gray-600 dark:text-gray-400"
                            fontSize={12}
                            tickFormatter={(value) => formatCurrency(value)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            dataKey="income"
                            fill="#10B981"
                            name="Income"
                            radius={[2, 2, 0, 0]}
                        />
                        <Bar
                            dataKey="expense"
                            fill="#EF4444"
                            name="Expenses"
                            radius={[2, 2, 0, 0]}
                        />
                        <Line
                            type="monotone"
                            dataKey="balance"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            name="Running Balance"
                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TransactionChart; 