// src/utils/currency.js

// 貨幣符號映射
export const CURRENCY_SYMBOLS = {
  'USD': '$',
  'EUR': '€',
  'JPY': '¥',
  'TWD': 'NT$'
};

// 支援的貨幣列表
export const CURRENCIES = ['USD', 'EUR', 'JPY', 'TWD'];

// 預設匯率（實際應用中應從API獲取）
export const DEFAULT_EXCHANGE_RATES = {
  USD: 31.5,
  EUR: 34.2,
  JPY: 0.21,
  TWD: 1
};

/**
 * 格式化貨幣顯示
 * @param {number} amount - 金額
 * @param {string} currency - 貨幣代碼
 * @returns {string} 格式化後的貨幣字符串
 */
export const formatCurrency = (amount, currency = 'USD') => {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const decimals = currency === 'JPY' ? 0 : 2;
  return `${symbol}${amount.toFixed(decimals)}`;
};

/**
 * 將金額轉換為基準貨幣
 * @param {number} amount - 原始金額
 * @param {string} fromCurrency - 原始貨幣
 * @param {string} baseCurrency - 目標基準貨幣
 * @param {Object} exchangeRates - 匯率對象
 * @returns {number} 轉換後的金額
 */
export const convertToBaseCurrency = (amount, fromCurrency, baseCurrency, exchangeRates) => {
  if (fromCurrency === baseCurrency) return amount;
  
  if (baseCurrency === 'TWD') {
    return amount * (exchangeRates[fromCurrency] || 1);
  } else {
    // 先轉成TWD，再轉成目標貨幣
    const twdAmount = amount * (exchangeRates[fromCurrency] || 1);
    return twdAmount / (exchangeRates[baseCurrency] || 1);
  }
};

/**
 * 模擬匯率更新（實際應用中應調用真實API）
 * @param {Object} currentRates - 當前匯率
 * @returns {Object} 更新後的匯率
 */
export const updateExchangeRates = (currentRates) => {
  return {
    ...currentRates,
    USD: currentRates.USD + (Math.random() - 0.5) * 0.5,
    EUR: currentRates.EUR + (Math.random() - 0.5) * 0.5,
    JPY: currentRates.JPY + (Math.random() - 0.5) * 0.01
  };
};