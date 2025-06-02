# Personal Finance Tracker

A React application for tracking personal income and expenses with a clean, responsive UI.

## Features

- Track income and expense transactions
- View financial summary (balance, income, expenses)
- Filter transactions by date range and transaction type
- Data persistence using localStorage
- Responsive design with Tailwind CSS

## Tech Stack

- React.js (v19) for the UI
- Redux (v5) for state management
- TypeScript for type safety
- Tailwind CSS for styling
- localStorage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository or download the source code

2. Navigate to the project directory:
```
cd budget_tracker
```

3. Install dependencies:
```
npm install
```

4. Start the development server:
```
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

### Adding Transactions

1. Fill out the "Add Transaction" form with:
   - Description of the transaction
   - Amount
   - Type (Income or Expense)
   - Category
   - Date

2. Click "Add Transaction" to save it

### Filtering Transactions

1. Click the "Filter" button to open the filter panel
2. Select transaction type (All, Income, Expense)
3. Set date range if desired
4. Click "Apply" to filter the transactions list
5. Click "Clear" to reset filters

## Development

### Folder Structure

```
src/
├── components/         # UI components
├── layout/             # Layout components
├── store/              # Redux store setup
│   ├── actions/        # Action creators
│   └── reducers/       # Redux reducers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

### Data Storage

The application uses localStorage to persist transaction data. This means your data will be saved between browser sessions but is limited to the browser you're using. For a production application, you'd want to connect it to a backend API.

## License

MIT
