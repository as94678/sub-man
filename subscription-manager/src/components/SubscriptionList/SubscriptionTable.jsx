// src/components/SubscriptionList/SubscriptionTable.jsx

import React from 'react';
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import { formatCurrency, convertToBaseCurrency } from '../../utils/currency';
import { addToGoogleCalendar } from '../../utils/googleCalendar';
import { getNextRenewalDate } from '../../utils/calendar';
import { CATEGORIES, COLORS } from '../../data/initialData';
import ServiceIcon from '../Common/ServiceIcon';

const SubscriptionTable = ({ 
  subscriptions, 
  baseCurrency, 
  exchangeRates, 
  darkMode,
  onEdit,
  onDelete
}) => {
  // 獲取類別對應的顏色
  const getCategoryColor = (category) => {
    const categoryIndex = CATEGORIES.indexOf(category);
    return categoryIndex !== -1 ? COLORS[categoryIndex] : COLORS[0];
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <th className="text-left py-3 px-4">服務名稱</th>
            <th className="text-left py-3 px-4">原價格</th>
            <th className="text-left py-3 px-4">轉換價格</th>
            <th className="text-left py-3 px-4">類別</th>
            <th className="text-left py-3 px-4">下次扣款</th>
            <th className="text-left py-3 px-4">操作</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map(sub => (
            <tr 
              key={sub.id} 
              className={`border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              } hover:bg-opacity-50 hover:bg-gray-500`}
            >
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <ServiceIcon 
                    serviceName={sub.name}
                    color={sub.color}
                    size="sm"
                  />
                  <span className="font-medium">{sub.name}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                {formatCurrency(sub.price, sub.currency)}
              </td>
              <td className="py-3 px-4">
                {sub.currency !== baseCurrency ? (
                  <span className="text-sm text-gray-500">
                    {formatCurrency(
                      convertToBaseCurrency(sub.price, sub.currency, baseCurrency, exchangeRates), 
                      baseCurrency
                    )}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </td>
              <td className="py-3 px-4">
                <span 
                  className="px-2 py-1 text-xs rounded-full bg-opacity-20" 
                  style={{
                    backgroundColor: `${getCategoryColor(sub.category)}20`, 
                    color: getCategoryColor(sub.category)
                  }}
                >
                  {sub.category}
                </span>
              </td>
              <td className="py-3 px-4 text-sm">
                {getNextRenewalDate(sub.renewalDate).toLocaleDateString('zh-TW')}
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => addToGoogleCalendar(sub)}
                    className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                    title="加入Google日曆"
                  >
                    <Calendar size={16} />
                  </button>
                  <button
                    onClick={() => onEdit(sub)}
                    className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                    title="編輯"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(sub.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                    title="刪除"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionTable;