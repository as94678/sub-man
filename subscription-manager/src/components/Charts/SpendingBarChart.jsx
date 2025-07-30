// src/components/Charts/SpendingBarChart.jsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency, convertToBaseCurrency } from '../../utils/currency';
import ServiceIcon from '../Common/ServiceIcon';

const SpendingBarChart = ({ sortedSubscriptions, baseCurrency, exchangeRates, darkMode }) => {
  const chartData = sortedSubscriptions.slice(0, 8).map((sub, index) => ({
    ...sub,
    convertedPrice: convertToBaseCurrency(sub.price, sub.currency, baseCurrency, exchangeRates),
    rank: index + 1
  }));

  // 計算總花費
  const totalSpending = chartData.reduce((sum, item) => sum + item.convertedPrice, 0);

  // 自訂工具提示
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = totalSpending > 0 ? ((data.convertedPrice / totalSpending) * 100).toFixed(1) : '0';
      
      return (
        <div className={`p-4 rounded-lg shadow-lg border ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <ServiceIcon 
              serviceName={data.name}
              color={data.color}
              size="sm"
            />
            <span className="font-medium">{data.name}</span>
          </div>
          <div className="space-y-1 text-sm">
            <div>原價格: {formatCurrency(data.price, data.currency)}</div>
            <div>轉換價格: {formatCurrency(data.convertedPrice, baseCurrency)}</div>
            <div>類別: {data.category}</div>
            <div>佔比: {percentage}%</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">📈 花費排名</h3>
        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          總計: {formatCurrency(totalSpending, baseCurrency)}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value, baseCurrency)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="convertedPrice" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* 排名列表 */}
      <div className="mt-4 space-y-2">
        <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          🏆 前三名服務
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {chartData.slice(0, 3).map((item, index) => (
            <div 
              key={item.id}
              className={`p-2 rounded-lg flex items-center space-x-2 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <span className="text-lg">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </span>
              <ServiceIcon 
                serviceName={item.name}
                color={item.color}
                size="xs"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{item.name}</div>
                <div className="text-xs text-gray-500">
                  {formatCurrency(item.convertedPrice, baseCurrency)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpendingBarChart;