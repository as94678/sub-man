// src/components/Forms/CurrencyConverter.jsx

import React from 'react';
import { CURRENCIES } from '../../utils/currency';

const CurrencyConverter = ({ exchangeRates, darkMode, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CURRENCIES.map(currency => (
            <div key={currency} className="text-center">
              <div className="text-sm text-gray-500">{currency}</div>
              <div className="font-semibold">
                {currency === 'TWD' ? '1.00' : exchangeRates[currency].toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;