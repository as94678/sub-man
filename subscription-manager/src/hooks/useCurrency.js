// src/hooks/useCurrency.js

import { useState, useCallback, useEffect, useRef } from 'react';
import { DEFAULT_EXCHANGE_RATES, updateExchangeRates } from '../utils/currency';

export const useCurrency = () => {
  const [baseCurrency, setBaseCurrency] = useState('TWD');
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_EXCHANGE_RATES);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [nextUpdateTime, setNextUpdateTime] = useState(null);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

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

  // 計算到下一個早上8點的毫秒數
  const getMillisecondsToNext8AM = useCallback(() => {
    const now = new Date();
    const next8AM = new Date();
    
    // 設置為今天早上8點
    next8AM.setHours(8, 0, 0, 0);
    
    // 如果當前時間已經過了今天的8點，設置為明天8點
    if (now.getTime() >= next8AM.getTime()) {
      next8AM.setDate(next8AM.getDate() + 1);
    }
    
    return next8AM.getTime() - now.getTime();
  }, []);

  // 設置每日定時更新
  const setupDailyUpdate = useCallback(() => {
    // 清理之前的定時器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const millisecondsToNext8AM = getMillisecondsToNext8AM();
    const nextUpdate = new Date(Date.now() + millisecondsToNext8AM);
    setNextUpdateTime(nextUpdate);
    
    console.log(`下次匯率更新時間: ${nextUpdate.toLocaleString()}`);
    
    // 設置到第一個8點的定時器
    timeoutRef.current = setTimeout(async () => {
      console.log('執行每日匯率自動更新...');
      await handleUpdateExchangeRates();
      
      // 設置下次更新時間為24小時後
      const nextDailyUpdate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      setNextUpdateTime(nextDailyUpdate);
      
      // 設置每24小時重複的定時器
      intervalRef.current = setInterval(async () => {
        console.log('執行每日匯率自動更新...');
        await handleUpdateExchangeRates();
        
        // 每次更新後設置下次更新時間
        const nextUpdate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        setNextUpdateTime(nextUpdate);
      }, 24 * 60 * 60 * 1000); // 24小時
    }, millisecondsToNext8AM);
  }, [getMillisecondsToNext8AM, handleUpdateExchangeRates]);

  // 初始載入時獲取匯率
  useEffect(() => {
    handleUpdateExchangeRates();
  }, [handleUpdateExchangeRates]);

  // 設置每日自動更新
  useEffect(() => {
    setupDailyUpdate();
    
    // 清理函數
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [setupDailyUpdate]);

  return {
    baseCurrency,
    exchangeRates,
    isLoading,
    lastUpdated,
    nextUpdateTime,
    setBaseCurrency: handleBaseCurrencyChange,
    updateExchangeRates: handleUpdateExchangeRates
  };
};