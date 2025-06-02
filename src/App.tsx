import React from 'react';

import './index.css';
import Layout from './layout/Layout';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ThemeProvider } from './contexts/ThemeContext';


function App() {


  return (
    <ThemeProvider>
      <CurrencyProvider>
        <Layout />
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
