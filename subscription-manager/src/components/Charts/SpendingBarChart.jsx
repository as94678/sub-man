// src/components/Charts/SpendingBarChart.jsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, convertToBaseCurrency } from '../../utils/currency';

const SpendingBarChart = ({ sortedSubscriptions, baseCurrency, exchangeRates, darkMode }) => {
  const chartData = sortedSubscriptions.slice(0, 8).map(sub => ({
    ...sub,
    convertedPrice: convertToBaseCurrency(sub.price, sub.currency, baseCurrency, exchangeRates)
  }));

  return (
    <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className="text-lg font-semibold mb-4">📈 花費排名</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />
          <Tooltip formatter={(value) => [formatCurrency(value, baseCurrency), '金額']} />
          <Bar dataKey="convertedPrice" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingBarChart;