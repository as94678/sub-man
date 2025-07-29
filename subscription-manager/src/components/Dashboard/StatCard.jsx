// src/components/Dashboard/StatCard.jsx

import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'pink', 
  darkMode 
}) => {
  const colorClasses = {
    pink: {
      text: 'text-pink-500',
      bg: 'bg-pink-100'
    },
    blue: {
      text: 'text-blue-500',
      bg: 'bg-blue-100'
    },
    orange: {
      text: 'text-orange-500',
      bg: 'bg-orange-100'
    },
    green: {
      text: 'text-green-500',
      bg: 'bg-green-100'
    }
  };

  const colors = colorClasses[color] || colorClasses.pink;

  return (
    <div className={`p-6 rounded-2xl shadow-lg ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } transition-all hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`text-2xl font-bold ${colors.text}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 ${colors.bg} rounded-full`}>
          <Icon className={colors.text} size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;