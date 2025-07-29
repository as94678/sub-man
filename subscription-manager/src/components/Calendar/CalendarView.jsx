// src/components/Calendar/CalendarView.jsx

import React, { useState } from 'react';
import CalendarGrid from './CalendarGrid';
import { generateCalendar, getMonthNavigation } from '../../utils/calendar';

const CalendarView = ({ subscriptions, darkMode }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendar = generateCalendar(currentMonth, subscriptions);
  const monthNav = getMonthNavigation(currentMonth);

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      setCurrentMonth(monthNav.previous);
    } else if (direction === 'next') {
      setCurrentMonth(monthNav.next);
    } else {
      setCurrentMonth(new Date()); // today
    }
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">
          📅 {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月 扣款日曆
        </h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className={`px-3 py-1 rounded ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors`}
          >
            ←
          </button>
          <button
            onClick={() => navigateMonth('today')}
            className={`px-3 py-1 rounded ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors text-sm`}
          >
            今天
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className={`px-3 py-1 rounded ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors`}
          >
            →
          </button>
        </div>
      </div>
      
      <CalendarGrid calendar={calendar} darkMode={darkMode} />
    </div>
  );
};

export default CalendarView;