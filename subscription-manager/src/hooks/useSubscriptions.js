// src/hooks/useSubscriptions.js

import { useState, useMemo, useEffect } from 'react';
import { INITIAL_SUBSCRIPTIONS, CATEGORIES, COLORS } from '../data/initialData';
import { convertToBaseCurrency } from '../utils/currency';
import { getUpcomingRenewals } from '../utils/calendar';
import { subscriptionAPI } from '../services/api';
import { useAuth } from './useAuth.jsx';

export const useSubscriptions = (baseCurrency, exchangeRates) => {
  const { isAuthenticated } = useAuth();
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 載入訂閱資料
  const loadSubscriptions = async () => {
    if (!isAuthenticated) {
      setSubscriptions(INITIAL_SUBSCRIPTIONS);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await subscriptionAPI.getAll();
      
      // 轉換日期格式和數據類型
      const formattedData = data.map(sub => ({
        ...sub,
        price: parseFloat(sub.price),
        renewalDate: sub.renewalDate.split('T')[0], // 轉換為 YYYY-MM-DD 格式
      }));
      
      setSubscriptions(formattedData);
    } catch (err) {
      console.error('載入訂閱失敗:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 當認證狀態改變時重新載入資料
  useEffect(() => {
    loadSubscriptions();
  }, [isAuthenticated]);

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
  const addSubscription = async (subscriptionData) => {
    if (!isAuthenticated) {
      // 訪客模式：本地新增
      const newSubscription = {
        ...subscriptionData,
        id: Date.now(),
        price: parseFloat(subscriptionData.price)
      };
      setSubscriptions(prev => [...prev, newSubscription]);
      return { success: true };
    }

    try {
      setError(null);
      const newSubscription = await subscriptionAPI.create({
        ...subscriptionData,
        price: parseFloat(subscriptionData.price)
      });
      
      // 格式化新訂閱並加入本地狀態
      const formattedSubscription = {
        ...newSubscription,
        price: parseFloat(newSubscription.price),
        renewalDate: newSubscription.renewalDate.split('T')[0],
      };
      
      setSubscriptions(prev => [...prev, formattedSubscription]);
      return { success: true };
    } catch (err) {
      console.error('新增訂閱失敗:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // 更新訂閱
  const updateSubscription = async (subscriptionData) => {
    if (!isAuthenticated) {
      // 訪客模式：本地更新
      const updatedSubscription = {
        ...subscriptionData,
        price: parseFloat(subscriptionData.price)
      };
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionData.id ? updatedSubscription : sub
        )
      );
      return { success: true };
    }

    try {
      setError(null);
      const updatedSubscription = await subscriptionAPI.update(subscriptionData.id, {
        ...subscriptionData,
        price: parseFloat(subscriptionData.price)
      });
      
      // 格式化更新的訂閱並更新本地狀態
      const formattedSubscription = {
        ...updatedSubscription,
        price: parseFloat(updatedSubscription.price),
        renewalDate: updatedSubscription.renewalDate.split('T')[0],
      };
      
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionData.id ? formattedSubscription : sub
        )
      );
      return { success: true };
    } catch (err) {
      console.error('更新訂閱失敗:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // 刪除訂閱
  const deleteSubscription = async (id) => {
    if (!isAuthenticated) {
      // 訪客模式：本地刪除
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      return { success: true };
    }

    try {
      setError(null);
      await subscriptionAPI.delete(id);
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      return { success: true };
    } catch (err) {
      console.error('刪除訂閱失敗:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    subscriptions,
    loading,
    error,
    totalMonthlySpending,
    categoryData,
    sortedSubscriptions,
    upcomingRenewals,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    refreshSubscriptions: loadSubscriptions,
  };
};