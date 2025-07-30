// src/components/Layout/Header.jsx

import React, { useState } from 'react';
import { Sun, Moon, RefreshCw, User, LogOut, Settings, LogIn } from 'lucide-react';
import { CURRENCIES } from '../../utils/currency';

const Header = ({ 
  darkMode, 
  toggleTheme, 
  baseCurrency, 
  setBaseCurrency, 
  updateExchangeRates,
  showCurrencyConverter,
  setShowCurrencyConverter,
  user,
  onLogout,
  onShowProfile,
  onShowLogin
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  return (
    <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            SUB-MAN
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={updateExchangeRates}
              className={`p-2 rounded-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors`}
              title="更新匯率"
            >
              <RefreshCw size={16} />
            </button>
            <select 
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className={`px-3 py-2 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              } transition-colors`}
            >
              {CURRENCIES.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <button
              onClick={() => setShowCurrencyConverter(!showCurrencyConverter)}
              className={`px-3 py-2 rounded-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors text-sm`}
            >
              匯率
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                darkMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white'
              } transition-colors hover:scale-110`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* 登入按鈕或用戶選單 */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors`}
                >
                  <User size={16} />
                  <span className="text-sm hidden sm:inline">{user.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 ${
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium">{user.name}</p>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onShowProfile && onShowProfile();
                        }}
                        className={`flex items-center w-full px-4 py-2 text-sm ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Settings size={16} className="mr-2" />
                        會員管理
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <LogOut size={16} className="mr-2" />
                        登出
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onShowLogin}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors`}
              >
                <LogIn size={16} />
                <span className="text-sm">登入</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;