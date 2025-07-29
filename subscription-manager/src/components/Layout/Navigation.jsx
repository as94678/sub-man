// src/components/Layout/Navigation.jsx

import React from 'react';
import { DollarSign, PieChart, Calendar, List } from 'lucide-react';

const Navigation = ({ activeView, setActiveView, darkMode }) => {
  const navItems = [
    { id: 'dashboard', label: '總覽', icon: DollarSign },
    { id: 'charts', label: '圖表分析', icon: PieChart },
    { id: 'calendar', label: '扣款日曆', icon: Calendar },
    { id: 'list', label: '訂閱清單', icon: List }
  ];

  return (
    <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto py-4">
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
      </div>
    </nav>
  );
};

export default Navigation;