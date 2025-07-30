// src/components/Charts/CategoryPieChart.jsx

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../utils/currency';

const CategoryPieChart = ({ categoryData, baseCurrency, darkMode }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  
  // 計算總金額
  const totalAmount = categoryData.reduce((sum, item) => sum + item.value, 0);
  
  // 自訂工具提示
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = totalAmount > 0 ? ((data.value / totalAmount) * 100).toFixed(1) : '0';
      
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        }`}>
          <div className="flex items-center space-x-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            />
            <span className="font-medium">{data.name}</span>
          </div>
          <div className="text-sm space-y-1">
            <div>金額: {formatCurrency(data.value, baseCurrency)}</div>
            <div>佔比: {percentage}%</div>
          </div>
        </div>
      );
    }
    return null;
  };

  // 自訂圖例
  const CustomLegend = ({ payload }) => {
    return (
      <div className="mt-4 space-y-2">
        <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          📋 類別明細
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {payload.map((entry, index) => {
            const percentage = totalAmount > 0 ? ((entry.value / totalAmount) * 100).toFixed(1) : '0';
            return (
              <div 
                key={index}
                className={`p-2 rounded-lg flex items-center space-x-2 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{entry.name}</div>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(entry.value, baseCurrency)} ({percentage}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">📊 類別分析</h3>
        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          總計: {formatCurrency(totalAmount, baseCurrency)}
        </div>
      </div>
      
      {categoryData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={entry.color}
                    strokeWidth={activeIndex === index ? 3 : 1}
                    style={{
                      filter: activeIndex === index ? 'brightness(1.1)' : 'brightness(1)',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <CustomLegend payload={categoryData.map(item => ({ name: item.name, value: item.value, color: item.color }))} />

          {/* 統計資訊 */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  最高花費類別
                </div>
                <div className="font-medium text-sm">
                  {categoryData.length > 0 ? categoryData[0].name : '-'}
                </div>
              </div>
              <div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  類別數量
                </div>
                <div className="font-medium text-sm">
                  {categoryData.length} 個
                </div>
              </div>
              <div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  平均花費
                </div>
                <div className="font-medium text-sm">
                  {formatCurrency(categoryData.length > 0 ? totalAmount / categoryData.length : 0, baseCurrency)}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="text-4xl mb-2">📊</div>
          <div>暫無訂閱資料</div>
        </div>
      )}
    </div>
  );
};

export default CategoryPieChart;