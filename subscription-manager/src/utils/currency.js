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
 * 從 rter.info API 獲取匯率數據
 * @returns {Promise<Object>} 匯率對象
 */
export const fetchExchangeRates = async () => {
  try {
    // 在開發環境使用代理，生產環境使用 CORS 代理服務
    const apiUrl = import.meta.env.DEV 
      ? '/api/exchange' 
      : 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://tw.rter.info/capi.php');
    
    const response = await fetch(apiUrl);
    let data = await response.json();
    
    // 如果使用 CORS 代理服務，需要解析包装的數據
    if (!import.meta.env.DEV && data.contents) {
      data = JSON.parse(data.contents);
    }
    
    // 轉換API數據格式為我們需要的格式（以TWD為基準）
    const rates = {
      TWD: 1, // 台幣作為基準
    };
    
    // 獲取USD對TWD的匯率（1 USD = X TWD）
    const usdToTwd = data['USDTWD']?.Exrate || 29.75;
    rates.USD = usdToTwd; // 1 USD = 29.75 TWD
    
    // 獲取其他貨幣對USD的匯率，然後轉換為對TWD的匯率
    if (data['USDEUR']) {
      const usdToEur = data['USDEUR'].Exrate; // 1 USD = X EUR
      // 1 EUR = (1/usdToEur) USD = (usdToTwd/usdToEur) TWD
      rates.EUR = usdToTwd / usdToEur;
    }
    
    if (data['USDJPY']) {
      const usdToJpy = data['USDJPY'].Exrate; // 1 USD = X JPY  
      // 1 JPY = (1/usdToJpy) USD = (usdToTwd/usdToJpy) TWD
      rates.JPY = usdToTwd / usdToJpy;
    }
    
    console.log('匯率更新成功:', rates);
    return rates;
  } catch (error) {
    console.error('匯率獲取失敗:', error);
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