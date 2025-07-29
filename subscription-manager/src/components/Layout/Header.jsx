// src/components/Layout/Header.jsx

import React from 'react';
import { Sun, Moon, RefreshCw } from 'lucide-react';
import { CURRENCIES } from '../../utils/currency';

const Header = ({ 
  darkMode, 
  toggleTheme, 
  baseCurrency, 
  setBaseCurrency, 
  updateExchangeRates,
  showCurrencyConverter,
  setShowCurrencyConverter
}) => {
  return (
    <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            🎀 訂閱小管家
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={updateExchangeRates}
              className={`p-2 rounded-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors`}
              title="更新匯率"
            >
              <RefreshCw size={16} />
            </button>
            <select 
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className={`px-3 py-2 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              } transition-colors`}
            >
              {CURRENCIES.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <button
              onClick={() => setShowCurrencyConverter(!showCurrencyConverter)}
              className={`px-3 py-2 rounded-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors text-sm`}
            >
              匯率
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                darkMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white'
              } transition-colors hover:scale-110`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;