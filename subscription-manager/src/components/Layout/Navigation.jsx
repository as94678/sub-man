// src/components/Layout/Navigation.jsx

import React from 'react';
import { DollarSign, PieChart, Calendar, List } from 'lucide-react';

const Navigation = ({ activeView, setActiveView, darkMode }) => {
  const navItems = [
    { id: 'dashboard', label: '總覽', shortLabel: '總覽', icon: DollarSign },
    { id: 'charts', label: '圖表分析', shortLabel: '圖表', icon: PieChart },
    { id: 'calendar', label: '扣款日曆', shortLabel: '日曆', icon: Calendar },
    { id: 'list', label: '訂閱清單', shortLabel: '清單', icon: List }
  ];

  return (
    <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md sticky top-0 z-40`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* 桌面端导航 */}
        <div className="hidden sm:flex space-x-8 overflow-x-auto py-4">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeView === id 
                  ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
                  : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>
        
        {/* 移动端导航 */}
        <div className="sm:hidden flex justify-around py-3">
          {navItems.map(({ id, label, shortLabel, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-colors min-w-0 flex-1 ${
                activeView === id 
                  ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
                  : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              <span className="text-xs font-medium truncate">{shortLabel}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;