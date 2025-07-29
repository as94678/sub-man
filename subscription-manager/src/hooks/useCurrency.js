// src/hooks/useCurrency.js

import { useState, useCallback, useEffect } from 'react';
import { DEFAULT_EXCHANGE_RATES, updateExchangeRates } from '../utils/currency';

export const useCurrency = () => {
  const [baseCurrency, setBaseCurrency] = useState('TWD');
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_EXCHANGE_RATES);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const handleUpdateExchangeRates = useCallback(async () => {
    setIsLoading(true);
    try {
      const newRates = await updateExchangeRates();
      setExchangeRates(newRates);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('匯率更新失敗:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBaseCurrencyChange = useCallback((currency) => {
    setBaseCurrency(currency);
  }, []);

  // 初始載入時獲取匯率
  useEffect(() => {
    handleUpdateExchangeRates();
  }, [handleUpdateExchangeRates]);

  return {
    baseCurrency,
    exchangeRates,
    isLoading,
    lastUpdated,
    setBaseCurrency: handleBaseCurrencyChange,
    updateExchangeRates: handleUpdateExchangeRates
  };
};