// src/hooks/useCurrency.js

import { useState, useCallback } from 'react';
import { DEFAULT_EXCHANGE_RATES, updateExchangeRates } from '../utils/currency';

export const useCurrency = () => {
  const [baseCurrency, setBaseCurrency] = useState('TWD');
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_EXCHANGE_RATES);

  const handleUpdateExchangeRates = useCallback(() => {
    setExchangeRates(current => updateExchangeRates(current));
  }, []);

  const handleBaseCurrencyChange = useCallback((currency) => {
    setBaseCurrency(currency);
  }, []);

  return {
    baseCurrency,
    exchangeRates,
    setBaseCurrency: handleBaseCurrencyChange,
    updateExchangeRates: handleUpdateExchangeRates
  };
};