// 登入表單組件

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import GoogleSignInButton from './GoogleSignInButton';

const LoginForm = ({ onSwitchToRegister, isModal = false }) => {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.email || !formData.password) {
      setLocalError('請填寫所有欄位');
      return;
    }

    const result = await login(formData);
    if (result.success && isModal) {
      // 在模態框中登入成功，關閉模態框
      window.location.reload(); // 重新整理以載入用戶資料
    } else if (!result.success) {
      setLocalError(result.error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 處理 Google 登入成功
  const handleGoogleSuccess = (user) => {
    if (isModal) {
      window.location.reload(); // 重新整理以載入用戶資料
    }
    // 對於非模態框，useAuth 會自動更新狀態，不需要額外處理
  };

  const containerClass = isModal 
    ? "w-full space-y-6" 
    : "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900";

  const formWrapperClass = isModal 
    ? "w-full" 
    : "max-w-md w-full space-y-8";

  return (
    <div className={containerClass}>
      <div className={formWrapperClass}>
        {!isModal && (
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              登入您的帳戶
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              或者{' '}
              <button
                onClick={onSwitchToRegister}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                註冊新帳戶
              </button>
            </p>
          </div>
        )}
        
        {isModal && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            或者{' '}
            <button
              onClick={onSwitchToRegister}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              註冊新帳戶
            </button>
          </p>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="電子郵件"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="密碼"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {(error || localError) && (
            <div className="text-red-600 text-sm text-center">
              {error || localError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? '登入中...' : '登入'}
            </button>
          </div>
        </form>

        {/* Google 登入 */}
        <GoogleSignInButton 
          onSuccess={handleGoogleSuccess}
          className="mt-6"
        />
      </div>
    </div>
  );
};

export default LoginForm;