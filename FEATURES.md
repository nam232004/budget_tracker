# Budget Tracker - Chart View & Export Features

## 📊 Chart Visualization Feature

The Budget Tracker now includes interactive chart visualization to help you understand your financial data better.

### Features
- **Combined Chart View**: Line chart showing running balance + bar chart showing income and expenses
- **Summary Cards**: Quick overview of total income, expenses, net balance, and transaction count
- **Interactive Tooltips**: Hover over data points to see detailed information
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Seamlessly integrates with the app's theme

### How to Use
1. In the Transactions section, look for the "Chart View" button next to the Filter button
2. Click "Chart View" to switch from the table view to the interactive chart
3. Click "List View" to switch back to the traditional table view
4. The chart automatically updates when you apply filters

### Technical Implementation
- **Hook**: `useViewMode()` - Manages view state (list/chart) with optimized callbacks
- **Hook**: `useChartData()` - Processes transaction data for chart visualization
- **Component**: `TransactionChart` - Renders the combined chart with summary cards
- **Library**: Uses Recharts for high-performance, responsive charts

## 📤 Export Feature

Export your transaction data to PDF or Excel format with customizable options.

### Export Formats
- **PDF**: Professional report with summary, categories breakdown, and transaction table
- **Excel**: Multi-sheet workbook with transactions, summary, and category data

### Export Options
- **Date Range**: Customize the period you want to export (defaults to current month)
- **Include Summary**: Add financial summary to the export
- **Include Categories**: Add category breakdown for expenses
- **Format Selection**: Choose between PDF or Excel

### How to Use
1. Click the "Export" button next to the Chart View toggle
2. Select your preferred format (PDF or Excel)
3. Set the date range (from/to dates)
4. Choose what to include in the export
5. Click "Export" to download the file

### Export Contents

#### PDF Export
- Transaction report title with date range
- Financial summary (total income, expenses, net balance)
- Expenses breakdown by category (sorted by amount)
- Complete transactions table with all details

#### Excel Export
- **Transactions Sheet**: All transaction data with original amounts and currencies
- **Summary Sheet**: Financial metrics and totals
- **Categories Sheet**: Expense breakdown by category

### File Naming
Files are automatically named with the date range: `transactions_YYYY-MM-DD_YYYY-MM-DD.pdf/xlsx`

## 🔧 Technical Architecture

### Optimal React Hooks Usage

#### 1. `useViewMode` Hook
```typescript
const { viewMode, toggleViewMode, isListView, isChartView } = useViewMode();
```
- **Purpose**: Manages view state between list and chart
- **Optimization**: Uses `useCallback` to prevent unnecessary re-renders
- **Benefits**: Reusable, type-safe, and performant

#### 2. `useChartData` Hook
```typescript
const { chartData, summary, hasData } = useChartData(transactions);
```
- **Purpose**: Processes raw transaction data for chart visualization
- **Optimization**: Uses `useMemo` for expensive calculations
- **Features**: Groups by date, calculates running balance, currency conversion

#### 3. Component Architecture
- **TransactionControls**: Reusable button group for view toggle and export
- **TransactionChart**: Pure chart component with summary cards
- **ExportModal**: Self-contained modal with all export logic
- **Layout**: Updated to orchestrate all components

### Performance Optimizations

1. **Memoized Calculations**: Chart data processing is memoized and only recalculates when transactions or currency changes
2. **Optimized Callbacks**: All event handlers use `useCallback` to prevent child re-renders
3. **Conditional Rendering**: Chart component only renders when in chart view
4. **Lazy Loading**: Export functionality only loads when modal is opened

### State Management
- **View Mode**: Local state using custom hook
- **Export Modal**: Local state in Layout component
- **Transaction Data**: Redux store (existing)
- **Currency Context**: Existing currency conversion system

## 🚀 Getting Started

### Dependencies Added
```bash
npm install recharts jspdf jspdf-autotable xlsx file-saver @types/file-saver
```

### New Files Created
```
src/
├── hooks/
│   ├── useViewMode.ts      # View mode management
│   └── useChartData.ts     # Chart data processing
├── components/
│   ├── TransactionChart.tsx    # Chart visualization
│   ├── TransactionControls.tsx # Control buttons
│   └── ExportModal.tsx         # Export functionality
└── FEATURES.md             # This documentation
```

### Integration Points
- **Layout.tsx**: Main integration point for all new features
- **Existing Redux Store**: Works with current transaction state
- **Currency Context**: Respects user's currency preference
- **Dark Mode**: All components support existing theme system

## 📱 Mobile Responsiveness

- Chart automatically adjusts to screen size
- Control buttons stack vertically on small screens
- Export modal is touch-friendly
- Summary cards responsive grid layout

## 🎨 Design Consistency

- Uses existing Tailwind classes and color scheme
- Follows app's dark mode implementation
- Consistent button styling with existing components
- Professional export layouts match app branding

## 🔮 Future Enhancements

- Additional chart types (pie charts for categories)
- Advanced filtering options for charts
- Scheduled exports
- Email delivery for exports
- Chart customization options
- Date range presets (last 7 days, last month, etc.)

---

**Note**: All features are implemented with TypeScript for type safety and use React best practices for optimal performance. 