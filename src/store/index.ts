import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './reducers/transactionsReducer';

// Configure store using Redux Toolkit
export const store = configureStore({
    reducer: {
        transactions: transactionsReducer,
    },
    // Redux Toolkit includes Redux DevTools Extension by default
    devTools: process.env.NODE_ENV !== 'production',
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 