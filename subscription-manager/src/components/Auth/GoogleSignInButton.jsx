// Google Sign-In 按鈕組件

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';

const GoogleSignInButton = ({ onSuccess, className = "" }) => {
  const { googleLogin, loading } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const buttonContainerRef = useRef(null);

  useEffect(() => {
    // 組件載入時初始化 Google 按鈕
    initializeGoogleButton();
  }, []);

  const initializeGoogleButton = async () => {
    try {
      // 檢查必要的 API 是否載入
      if (!window.google || !window.google.accounts) {
        console.error('Google Identity Services 尚未載入');
        return;
      }

      if (!window.gapi) {
        console.error('Google API 尚未載入');
        return;
      }

      // 先初始化 Google API
      await new Promise((resolve) => {
        window.gapi.load('client', resolve);
      });

      // 使用 OAuth 2.0 流程，一次取得所有權限
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly',
        callback: async (tokenResponse) => {
          setLocalLoading(true);
          try {
            // 使用獲得的 access token 來取得用戶資訊
            const userInfoResponse = await fetch(
              `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`
            );
            const userInfo = await userInfoResponse.json();

            // 創建 ID token 模擬物件給後端
            const mockCredential = btoa(JSON.stringify({
              iss: 'https://accounts.google.com',
              sub: userInfo.id,
              email: userInfo.email,
              name: userInfo.name,
              picture: userInfo.picture,
              access_token: tokenResponse.access_token // 包含 access token
            }));

            const result = await googleLogin(mockCredential);
            if (result.success) {
              // 儲存 Gmail access token 供後續使用
              localStorage.setItem('gmail_access_token', tokenResponse.access_token);
              onSuccess?.(result.user);
            }
          } catch (error) {
            console.error('Google 登入失敗:', error);
          } finally {
            setLocalLoading(false);
          }
        },
      });

      // 創建自定義按鈕
      if (buttonContainerRef.current) {
        buttonContainerRef.current.innerHTML = `
          <button 
            type="button"
            class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            使用 Google 登入 (含 Gmail 權限)
          </button>
        `;

        const button = buttonContainerRef.current.querySelector('button');
        button.addEventListener('click', () => {
          tokenClient.requestAccessToken({ prompt: 'consent' });
        });
      }

    } catch (error) {
      console.error('Google Sign-In 初始化失敗:', error);
    }
  };

  const isLoading = loading || localLoading;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">或者</span>
        </div>
      </div>
      
      <div className="mt-6">
        {isLoading && (
          <div className="flex justify-center items-center py-3 mb-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">登入中...</span>
          </div>
        )}
        
        {/* Google 官方按鈕容器 */}
        <div 
          ref={buttonContainerRef}
          className={`w-full ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        />
      </div>
    </div>
  );
};

export default GoogleSignInButton;