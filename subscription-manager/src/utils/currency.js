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

// 預設匯率（作為備用值）
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
 * 從免費匯率 API 獲取匯率數據
 * @returns {Promise<Object>} 匯率對象
 */
export const fetchExchangeRates = async () => {
  try {
    // 使用免費的 exchangerate-api.com 服務
    const apiUrl = 'https://api.exchangerate-api.com/v4/latest/TWD';
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!data.rates) {
      throw new Error('Invalid API response');
    }
    
    // 將匯率轉換為以TWD為基準的格式
    const rates = {
      TWD: 1, // 台幣作為基準
      USD: 1 / data.rates.USD, // API返回的是TWD對其他貨幣的匯率，我們需要反向
      EUR: 1 / data.rates.EUR,
      JPY: 1 / data.rates.JPY
    };
    
    console.log('匯率更新成功:', rates);
    return rates;
  } catch (error) {
    console.error('匯率獲取失敗，使用預設匯率:', error);
    return DEFAULT_EXCHANGE_RATES;
  }
};

/**
 * 更新匯率（從真實API獲取）
 * @returns {Promise<Object>} 更新後的匯率
 */
export const updateExchangeRates = async () => {
  return await fetchExchangeRates();
};