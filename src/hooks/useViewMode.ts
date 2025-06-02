import { useState, useCallback } from 'react';

export type ViewMode = 'list' | 'chart';

export const useViewMode = (initialMode: ViewMode = 'list') => {
    const [viewMode, setViewMode] = useState<ViewMode>(initialMode);

    const toggleViewMode = useCallback(() => {
        setViewMode(prev => prev === 'list' ? 'chart' : 'list');
    }, []);

    const setToList = useCallback(() => {
        setViewMode('list');
    }, []);

    const setToChart = useCallback(() => {
        setViewMode('chart');
    }, []);

    return {
        viewMode,
        toggleViewMode,
        setToList,
        setToChart,
        isListView: viewMode === 'list',
        isChartView: viewMode === 'chart'
    };
}; 