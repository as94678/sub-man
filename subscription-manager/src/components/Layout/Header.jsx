// src/components/Layout/Header.jsx

import React, { useState } from 'react';
import { Sun, Moon, RefreshCw, User, LogOut, Settings, LogIn, Database, Menu, X } from 'lucide-react';
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
  onShowLogin,
  onShowDataManager
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  return (
    <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            SUB-MAN
          </h1>
          
          {/* 桌面端控制項 */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={updateExchangeRates}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors`}
              title="更新匯率"
            >
              <RefreshCw size={16} />
            </button>
            <select 
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-100'
              } transition-colors`}
            >
              {CURRENCIES.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <button
              onClick={() => setShowCurrencyConverter(!showCurrencyConverter)}
              className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors text-sm`}
            >
              匯率
            </button>
            <button
              onClick={onShowDataManager}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors`}
              title="數據管理"
            >
              <Database size={16} />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${darkMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white'
              } transition-colors hover:scale-110`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* 桌面端登入按鈕或用戶選單 */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors`}
                >
                  <User size={16} />
                  <span className="text-sm">{user.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
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
                        className={`flex items-center w-full px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
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
                        className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
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
          
          {/* 移動端控制項 */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${darkMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white'
              } transition-colors`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {user ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors`}
              >
                <User size={18} />
              </button>
            ) : (
              <button
                onClick={onShowLogin}
                className={`px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm`}
              >
                登入
              </button>
            )}
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors`}
            >
              {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        
        {/* 移動端選單 */}
        {showMobileMenu && (
          <div className={`md:hidden border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} py-4`}>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">貨幣:</span>
                <select 
                  value={baseCurrency}
                  onChange={(e) => setBaseCurrency(e.target.value)}
                  className={`px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  } transition-colors`}
                >
                  {CURRENCIES.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    updateExchangeRates();
                    setShowMobileMenu(false);
                  }}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors text-sm`}
                >
                  <RefreshCw size={16} />
                  <span>更新匯率</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowCurrencyConverter(!showCurrencyConverter);
                    setShowMobileMenu(false);
                  }}
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors text-sm`}
                >
                  匯率轉換
                </button>
              </div>
              
              <button
                onClick={() => {
                  onShowDataManager();
                  setShowMobileMenu(false);
                }}
                className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors text-sm`}
              >
                <Database size={16} />
                <span>數據管理</span>
              </button>
            </div>
          </div>
        )}
        
        {/* 移動端用戶選單 */}
        {showUserMenu && user && (
          <div className={`md:hidden absolute left-0 right-0 top-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border-t shadow-lg z-50`}>
            <div className="px-4 py-3">
              <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                <p className="font-medium">{user.name}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user.email}
                </p>
              </div>
              <div className="pt-3 space-y-2">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onShowProfile && onShowProfile();
                  }}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Settings size={16} className="mr-3" />
                  會員管理
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className={`flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <LogOut size={16} className="mr-3" />
                  登出
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;