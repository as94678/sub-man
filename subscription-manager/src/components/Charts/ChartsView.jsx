// src/components/Charts/ChartsView.jsx

import React from 'react';
import CategoryPieChart from './CategoryPieChart';
import SpendingBarChart from './SpendingBarChart';
import { formatCurrency, convertToBaseCurrency } from '../../utils/currency';

const ChartsView = ({ 
  categoryData, 
  sortedSubscriptions, 
  baseCurrency, 
  exchangeRates, 
  darkMode 
}) => {
  // 計算統計資料
  const totalSubscriptions = sortedSubscriptions.length;
  const totalMonthlySpending = sortedSubscriptions.reduce((total, sub) => {
    return total + convertToBaseCurrency(sub.price, sub.currency, baseCurrency, exchangeRates);
  }, 0);
  
  const averageSpending = totalSubscriptions > 0 ? totalMonthlySpending / totalSubscriptions : 0;
  const highestSpending = sortedSubscriptions.length > 0 ? sortedSubscriptions[0] : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 概覽統計卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className={`p-3 sm:p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-2xl">💰</span>
            <div className="min-w-0 flex-1">
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                月總花費
              </div>
              <div className="font-semibold text-xs sm:text-sm truncate">
                {formatCurrency(totalMonthlySpending, baseCurrency)}
              </div>
            </div>
          </div>
        </div>

        <div className={`p-3 sm:p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-2xl">📱</span>
            <div className="min-w-0 flex-1">
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                訂閱數量
              </div>
              <div className="font-semibold text-xs sm:text-sm">
                {totalSubscriptions} 個
              </div>
            </div>
          </div>
        </div>

        <div className={`p-3 sm:p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-2xl">📊</span>
            <div className="min-w-0 flex-1">
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                平均花費
              </div>
              <div className="font-semibold text-xs sm:text-sm truncate">
                {formatCurrency(averageSpending, baseCurrency)}
              </div>
            </div>
          </div>
        </div>

        <div className={`p-3 sm:p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-2xl">🏆</span>
            <div className="min-w-0 flex-1">
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                最高花費
              </div>
              <div className="font-semibold text-xs truncate">
                {highestSpending ? highestSpending.name : '-'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 圖表區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <CategoryPieChart
          categoryData={categoryData}
          baseCurrency={baseCurrency}
          darkMode={darkMode}
        />
        
        <SpendingBarChart
          sortedSubscriptions={sortedSubscriptions}
          baseCurrency={baseCurrency}
          exchangeRates={exchangeRates}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default ChartsView;