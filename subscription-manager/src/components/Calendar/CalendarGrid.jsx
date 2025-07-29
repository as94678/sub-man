// src/components/Calendar/CalendarGrid.jsx

import React from 'react';
import { formatCurrency } from '../../utils/currency';

const CalendarGrid = ({ calendar, darkMode }) => {
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div>
      {/* 日曆標題 */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map(day => (
          <div key={day} className="p-2 text-center font-semibold text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      {/* 日曆主體 */}
      <div className="space-y-2">
        {calendar.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`min-h-[100px] p-2 border rounded-lg transition-colors ${
                  day.isCurrentMonth 
                    ? darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                    : darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'
                } ${
                  day.isToday ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  day.isCurrentMonth ? '' : 'text-gray-400'
                } ${
                  day.isToday ? 'text-blue-500' : ''
                }`}>
                  {day.date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {day.subscriptions.map(sub => (
                    <div
                      key={sub.id}
                      className="text-xs p-1 rounded truncate"
                      style={{ backgroundColor: sub.color + '20', color: sub.color }}
                      title={`${sub.name} - ${formatCurrency(sub.price, sub.currency)}`}
                    >
                      {sub.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;