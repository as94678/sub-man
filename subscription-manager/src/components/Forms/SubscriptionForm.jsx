// src/components/Forms/SubscriptionForm.jsx

import React, { useState, useEffect } from 'react';
import { CATEGORIES, COLORS } from '../../data/initialData';
import { CURRENCIES } from '../../utils/currency';
import { formatCurrency, convertToBaseCurrency } from '../../utils/currency';

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

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? '編輯訂閱' : '新增訂閱'}
      </h3>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="服務名稱"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full p-3 rounded-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
          } transition-colors`}
          required
        />
        
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="價格"
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
        
        <input
          type="date"
          value={formData.renewalDate}
          onChange={(e) => handleInputChange('renewalDate', e.target.value)}
          className={`w-full p-3 rounded-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
          } transition-colors`}
          required
        />

        <div>
          <label className="block text-sm text-gray-600 mb-2">選擇顏色</label>
          <div className="flex space-x-2 flex-wrap">
            {COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => handleInputChange('color', color)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  formData.color === color ? 'border-gray-400' : 'border-transparent'
                }`}
                style={{backgroundColor: color}}
              />
            ))}
          </div>
        </div>

        {isEditing && formData.price && (
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className="text-sm text-gray-600 mb-2">價格預覽：</p>
            <div className="space-y-1 text-sm">
              <div>原價格: {formatCurrency(parseFloat(formData.price) || 0, formData.currency)}</div>
              {formData.currency !== baseCurrency && (
                <div>轉換價格: {formatCurrency(convertToBaseCurrency(parseFloat(formData.price) || 0, formData.currency, baseCurrency, exchangeRates), baseCurrency)}</div>
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