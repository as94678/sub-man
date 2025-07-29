// src/hooks/useSubscriptions.js

import { useState, useMemo } from 'react';
import { INITIAL_SUBSCRIPTIONS, CATEGORIES, COLORS } from '../data/initialData';
import { convertToBaseCurrency } from '../utils/currency';
import { getUpcomingRenewals } from '../utils/calendar';

export const useSubscriptions = (baseCurrency, exchangeRates) => {
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);

  // 計算總月花費（轉換為基準貨幣）
  const totalMonthlySpending = useMemo(() => {
    return subscriptions.reduce((total, sub) => {
      return total + convertToBaseCurrency(sub.price, sub.currency, baseCurrency, exchangeRates);
    }, 0);
  }, [subscriptions, baseCurrency, exchangeRates]);

  // 按類別分組計算數據
  const categoryData = useMemo(() => {
    return CATEGORIES.map(category => {
      const categoryTotal = subscriptions
        .filter(sub => sub.category === category)
        .reduce((total, sub) => 
          total + convertToBaseCurrency(sub.price, sub.currency, baseCurrency, exchangeRates), 0);
      
      return {
        name: category,
        value: categoryTotal,
        color: COLORS[CATEGORIES.indexOf(category)]
      };
    }).filter(item => item.value > 0);
  }, [subscriptions, baseCurrency, exchangeRates]);

  // 排序的訂閱（按轉換後價格排序）
  const sortedSubscriptions = useMemo(() => {
    return [...subscriptions].sort((a, b) => 
      convertToBaseCurrency(b.price, b.currency, baseCurrency, exchangeRates) - 
      convertToBaseCurrency(a.price, a.currency, baseCurrency, exchangeRates)
    );
  }, [subscriptions, baseCurrency, exchangeRates]);

  // 即將到期的訂閱
  const upcomingRenewals = useMemo(() => {
    return getUpcomingRenewals(subscriptions);
  }, [subscriptions]);

  // 新增訂閱
  const addSubscription = (subscriptionData) => {
    const newSubscription = {
      ...subscriptionData,
      id: Date.now(),
      price: parseFloat(subscriptionData.price)
    };
    setSubscriptions(prev => [...prev, newSubscription]);
  };

  // 更新訂閱
  const updateSubscription = (subscriptionData) => {
    const updatedSubscription = {
      ...subscriptionData,
      price: parseFloat(subscriptionData.price)
    };
    setSubscriptions(prev => 
      prev.map(sub => 
        sub.id === subscriptionData.id ? updatedSubscription : sub
      )
    );
  };

  // 刪除訂閱
  const deleteSubscription = (id) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  return {
    subscriptions,
    totalMonthlySpending,
    categoryData,
    sortedSubscriptions,
    upcomingRenewals,
    addSubscription,
    updateSubscription,
    deleteSubscription
  };
};