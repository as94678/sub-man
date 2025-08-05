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
    <div className={`p-4 sm:p-6 rounded-2xl shadow-lg ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } transition-all hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <p className={`text-lg sm:text-2xl font-bold ${colors.text} truncate`}>
            {value}
          </p>
        </div>
        <div className={`p-2 sm:p-3 ${colors.bg} rounded-full flex-shrink-0 ml-3`}>
          <Icon className={colors.text} size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;