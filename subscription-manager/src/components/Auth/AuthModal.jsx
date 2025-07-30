// 認證模態框組件

import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ isOpen, onClose, darkMode }) => {
  const [authMode, setAuthMode] = useState('login');

  if (!isOpen) return null;

  const handleSwitchToLogin = () => setAuthMode('login');
  const handleSwitchToRegister = () => setAuthMode('register');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* 背景遮罩 */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>
        
        {/* 模態框內容 */}
        <div className={`relative w-full max-w-md rounded-lg shadow-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* 關閉按鈕 */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } transition-colors`}
          >
            <X size={20} />
          </button>

          {/* 表單內容 */}
          <div className="p-6">
            {authMode === 'login' ? (
              <div>
                <h2 className="mb-4 text-2xl font-bold text-center">
                  登入您的帳戶
                </h2>
                <p className={`mb-6 text-center text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  登入後可同步您的訂閱資料
                </p>
                <LoginForm 
                  onSwitchToRegister={handleSwitchToRegister}
                  isModal={true}
                />
              </div>
            ) : (
              <div>
                <h2 className="mb-4 text-2xl font-bold text-center">
                  註冊新帳戶
                </h2>
                <p className={`mb-6 text-center text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  建立帳戶以保存您的訂閱資料
                </p>
                <RegisterForm 
                  onSwitchToLogin={handleSwitchToLogin}
                  isModal={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;