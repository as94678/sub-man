// src/components/Forms/SubscriptionForm.jsx

import React, { useState, useEffect } from 'react';
import { CATEGORIES, COLORS } from '../../data/initialData';
import { CURRENCIES } from '../../utils/currency';
import { formatCurrency, convertToBaseCurrency } from '../../utils/currency';
import ServiceSelector from './ServiceSelector';
import GmailScanner from '../GmailScanner';

const SubscriptionForm = ({ 
  subscription, 
  onSubmit, 
  onCancel, 
  darkMode,
  baseCurrency,
  exchangeRates
}) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'USD',
    renewalDate: '',
    category: '娛樂',
    color: '#3B82F6'
  });
  
  const [showGmailScanner, setShowGmailScanner] = useState(false);

  const isEditing = !!subscription;

  useEffect(() => {
    if (subscription) {
      setFormData({
        ...subscription,
        price: subscription.price.toString()
      });
    }
  }, [subscription]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    
    onSubmit({
      ...formData,
      price: parseFloat(formData.price)
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 處理服務選擇 - 自動填入相關欄位
  const handleServiceSelect = (serviceData) => {
    setFormData(prev => ({
      ...prev,
      ...serviceData
    }));
  };

  // 處理 Gmail 掃描結果
  const handleGmailResults = (foundSubscriptions) => {
    if (foundSubscriptions.length > 0) {
      const subscription = foundSubscriptions[0]; // 取第一個結果
      setFormData(prev => ({
        ...prev,
        name: subscription.name,
        price: subscription.amount.toString(),
        currency: subscription.currency,
        renewalDate: subscription.renewalDate,
        category: subscription.category,
        color: subscription.color || prev.color
      }));
      setShowGmailScanner(false); // 關閉掃描器
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {isEditing ? '編輯訂閱' : '新增訂閱'}
        </h3>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setShowGmailScanner(!showGmailScanner)}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
          >
            📧 Gmail 掃描
          </button>
        )}
      </div>


      {/* Gmail 掃描器 */}
      {showGmailScanner && (
        <div className="mb-6">
          <GmailScanner onSubscriptionsFound={handleGmailResults} />
        </div>
      )}
      
      <div className="space-y-4">
        {/* 智能服務選擇器 */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            服務名稱
          </label>
          <ServiceSelector
            value={formData.name}
            onChange={(value) => handleInputChange('name', value)}
            onServiceSelect={handleServiceSelect}
            darkMode={darkMode}
            placeholder="搜尋或輸入服務名稱..."
          />
          <p className={`text-xs mt-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            💡 選擇熱門服務會自動填入價格和類別
          </p>
        </div>
        
        {/* 價格和貨幣 */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            價格
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className={`flex-1 p-3 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } transition-colors`}
              required
            />
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className={`p-3 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } transition-colors`}
            >
              {CURRENCIES.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* 類別 */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            類別
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full p-3 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            } transition-colors`}
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        {/* 續費日期 */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            下次續費日期
          </label>
          <input
            type="date"
            value={formData.renewalDate}
            onChange={(e) => handleInputChange('renewalDate', e.target.value)}
            className={`w-full p-3 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            } transition-colors`}
            required
          />
        </div>

        {/* 顏色選擇 */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            主題顏色
          </label>
          <div className="flex space-x-2 flex-wrap">
            {COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => handleInputChange('color', color)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  formData.color === color 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{backgroundColor: color}}
                title={`選擇 ${color} 顏色`}
              />
            ))}
          </div>
          <p className={`text-xs mt-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            選擇一個代表此服務的顏色
          </p>
        </div>

        {formData.price && (
          <div className={`p-4 rounded-lg border ${
            darkMode ? 'bg-gray-800 border-gray-600' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${
                darkMode ? 'bg-blue-400' : 'bg-blue-500'
              }`}></div>
              <p className={`text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                價格預覽
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  原價格:
                </span>
                <span className="font-medium">
                  {formatCurrency(parseFloat(formData.price) || 0, formData.currency)}
                </span>
              </div>
              {formData.currency !== baseCurrency && (
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    轉換為 {baseCurrency}:
                  </span>
                  <span className="font-medium text-blue-600">
                    {formatCurrency(convertToBaseCurrency(parseFloat(formData.price) || 0, formData.currency, baseCurrency, exchangeRates), baseCurrency)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className={`flex-1 py-2 px-4 rounded-lg border ${
            darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
          } transition-colors`}
        >
          取消
        </button>
        <button
          type="submit"
          className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:scale-105 transition-transform"
        >
          {isEditing ? '更新' : '新增'}
        </button>
      </div>

    </form>
  );
};

export default SubscriptionForm;