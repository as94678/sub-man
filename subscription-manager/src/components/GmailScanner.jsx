import React, { useState, useEffect } from 'react';
import { Mail, Search, CheckCircle, XCircle, AlertCircle, Shield, Settings, User } from 'lucide-react';
import { GmailService } from '../services/gmailService';
import { EmailParser } from '../utils/emailPatterns';
import { validateGmailConfig } from '../config/gmail';
import { useAuth } from '../hooks/useAuth';
import EmailDebugger from './Debug/EmailDebugger';

const GmailScanner = ({ onSubscriptionsFound }) => {
  const { user, isAuthenticated } = useAuth();
  const [gmailService] = useState(() => new GmailService());
  const [status, setStatus] = useState('idle'); // idle, initializing, authorizing, scanning, completed, error
  const [progress, setProgress] = useState(0);
  const [foundSubscriptions, setFoundSubscriptions] = useState([]);
  const [error, setError] = useState(null);
  const [emailsScanned, setEmailsScanned] = useState(0);
  const [totalEmails, setTotalEmails] = useState(0);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [configValid, setConfigValid] = useState(false);
  const [debugEmails, setDebugEmails] = useState([]); // 儲存郵件用於調試

  // 檢查 Google API 和配置
  useEffect(() => {
    const checkSetup = () => {
      // 檢查 Google API 和 GSI
      if (typeof window.gapi === 'undefined') {
        setError('Google API 尚未載入。請確認 index.html 中已加入 Google API script 標籤。');
        setStatus('error');
        return;
      }

      if (typeof window.google === 'undefined' || !window.google.accounts) {
        setError('Google Identity Services 尚未載入。請確認 index.html 中已加入 GSI script 標籤。');
        setStatus('error');
        return;
      }

      // 檢查配置
      const configValidation = validateGmailConfig();
      setConfigValid(configValidation.isValid);
      
      if (!configValidation.isValid) {
        setError(configValidation.errors.join('; '));
        setStatus('error');
      }
    };

    // 延遲檢查，確保 script 有時間載入
    const timer = setTimeout(checkSetup, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 開始掃描流程
  const handleScan = async () => {
    try {
      setStatus('initializing');
      setError(null);
      setProgress(0);
      setFoundSubscriptions([]);
      
      // 初始化 Gmail API
      await gmailService.initialize();
      setProgress(20);
      
      // 使用者授權
      setStatus('authorizing');
      await gmailService.authorize();
      setProgress(40);
      
      // 搜尋郵件
      setStatus('scanning');
      const messages = await gmailService.searchSubscriptionEmails();
      setTotalEmails(messages.length);
      setProgress(50);
      
      // 解析郵件
      const subscriptions = [];
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        setEmailsScanned(i + 1);
        
        const emailDetails = await gmailService.getEmailDetails(message.id);
        if (emailDetails) {
          // 儲存郵件用於調試
          setDebugEmails(prev => [...prev, emailDetails]);
          
          console.log(`📧 郵件 ${i + 1}:`, {
            from: emailDetails.from,
            subject: emailDetails.subject,
            bodyPreview: emailDetails.body ? emailDetails.body.substring(0, 200) + '...' : '無內容'
          });
          
          const subscription = EmailParser.parseSubscriptionEmail(emailDetails);
          if (subscription) {
            console.log(`✅ 識別結果 (信心度: ${subscription.confidence}%):`, subscription);
            if (subscription.confidence >= 60) {
              subscriptions.push(subscription);
            } else {
              console.log(`❌ 信心度太低 (${subscription.confidence}% < 60%)，不加入`);
            }
          } else {
            console.log(`❌ 無法識別為訂閱服務`);
          }
        }
        
        // 更新進度
        setProgress(50 + (i + 1) / messages.length * 40);
        
        // 避免 API 限制，添加小延遲
        if (i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // 去重複
      const uniqueSubscriptions = removeDuplicates(subscriptions);
      setFoundSubscriptions(uniqueSubscriptions);
      setProgress(100);
      setStatus('completed');
      
    } catch (error) {
      console.error('掃描失敗:', error);
      console.error('完整錯誤物件:', JSON.stringify(error, null, 2));
      
      // 更詳細的錯誤處理
      let errorMessage = '未知錯誤';
      
      if (error.message && error.message.includes('授權已過期')) {
        errorMessage = 'Gmail 授權已過期，請重新登入以獲取新的授權';
        // 清除過期的 tokens
        localStorage.removeItem('gmail_access_token');
        localStorage.removeItem('authToken');
        
        // 提示用戶重新登入
        setTimeout(() => {
          if (window.confirm('Gmail 授權已過期，需要重新登入。是否現在重新登入？')) {
            window.location.reload();
          }
        }, 1000);
      } else if (error.error === 'idpiframe_initialization_failed') {
        errorMessage = `Google OAuth 初始化失敗：${error.details || error.message}`;
      } else if (error.message && error.message.includes('deprecated')) {
        errorMessage = 'Google API 已更新。請檢查是否使用最新的驗證方式。';
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.details) {
        errorMessage = error.details;
      }
      
      setError(errorMessage);
      setStatus('error');
    }
  };

  // 移除重複的訂閱
  const removeDuplicates = (subscriptions) => {
    const seen = new Set();
    return subscriptions.filter(sub => {
      const key = `${sub.name.toLowerCase()}-${sub.amount}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  // 確認新增訂閱
  const handleConfirmSubscription = (subscription) => {
    onSubscriptionsFound([subscription]);
    // 從列表中移除已確認的項目
    setFoundSubscriptions(prev => prev.filter(sub => sub !== subscription));
  };

  // 忽略訂閱
  const handleIgnoreSubscription = (subscription) => {
    setFoundSubscriptions(prev => prev.filter(sub => sub !== subscription));
  };

  // 確認所有訂閱
  const handleConfirmAll = () => {
    onSubscriptionsFound(foundSubscriptions);
    setFoundSubscriptions([]);
  };

  // 重置狀態
  const handleReset = () => {
    setStatus('idle');
    setProgress(0);
    setFoundSubscriptions([]);
    setError(null);
    setEmailsScanned(0);
    setTotalEmails(0);
    setDebugEmails([]); // 清除調試資料
  };

  // 狀態訊息
  const getStatusMessage = () => {
    const isGoogleUser = isAuthenticated && user?.provider === 'google';
    
    switch (status) {
      case 'initializing':
        return '正在初始化 Gmail API...';
      case 'authorizing':
        return isGoogleUser ? '正在授權 Gmail 存取權限...' : '等待 Google 授權...';
      case 'scanning':
        return `正在掃描郵件... (${emailsScanned}/${totalEmails})`;
      case 'completed':
        return `掃描完成！找到 ${foundSubscriptions.length} 個訂閱服務`;
      case 'error':
        return '掃描過程中發生錯誤';
      default:
        return isGoogleUser ? '準備掃描您的 Gmail 訂閱郵件' : '準備掃描您的 Gmail 訂閱郵件';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border">
      {/* 標題區域 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gmail 自動掃描</h3>
          <p className="text-sm text-gray-600">自動識別您的訂閱服務</p>
        </div>
      </div>

      {/* 隱私說明和用戶狀態 */}
      <div className="space-y-3 mb-4">
        {isAuthenticated && user?.provider === 'google' && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <User className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              已使用 Google 帳號登入 ({user.email})，Gmail 掃描將更加順暢
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-800">
            您的郵件資料完全在瀏覽器中處理，不會上傳到我們的伺服器
          </span>
        </div>
      </div>

      {/* 掃描按鈕或進度 */}
      {status === 'idle' ? (
        configValid ? (
          <button
            onClick={handleScan}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            開始掃描 Gmail
          </button>
        ) : (
          <button
            onClick={() => setShowSetupGuide(true)}
            className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
          >
            <Settings className="w-5 h-5" />
            設定 Gmail API
          </button>
        )
      ) : status === 'error' ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">掃描失敗</span>
          </div>
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              重新開始
            </button>
            {!configValid && (
              <button
                onClick={() => setShowSetupGuide(true)}
                className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-1"
              >
                <Settings className="w-4 h-4" />
                設定說明
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 進度條 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{getStatusMessage()}</span>
              <span className="text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 掃描結果 */}
          {status === 'completed' && foundSubscriptions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">發現的訂閱服務</h4>
                <button
                  onClick={handleConfirmAll}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                >
                  全部新增
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {foundSubscriptions.map((subscription, index) => (
                  <SubscriptionCard
                    key={index}
                    subscription={subscription}
                    onConfirm={() => handleConfirmSubscription(subscription)}
                    onIgnore={() => handleIgnoreSubscription(subscription)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 完成但沒找到結果 */}
          {status === 'completed' && foundSubscriptions.length === 0 && (
            <div className="text-center py-6">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">未找到可識別的訂閱服務</p>
              <p className="text-sm text-gray-500 mt-1">
                可能需要手動新增，或訂閱郵件格式不在我們的識別範圍內
              </p>
              <button
                onClick={handleReset}
                className="mt-3 text-blue-600 hover:text-blue-700 text-sm"
              >
                重新掃描
              </button>
              
              {/* 調試工具 */}
              {debugEmails.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">🔧 調試資訊</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    掃描了 {debugEmails.length} 封郵件，以下是詳細資料：
                  </p>
                  {debugEmails.map((email, index) => (
                    <EmailDebugger key={email.id} emailDetails={email} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 設定指引彈出視窗 */}
      {showSetupGuide && (
        <GmailSetupGuide onClose={() => setShowSetupGuide(false)} />
      )}
    </div>
  );
};

// 訂閱卡片組件
const SubscriptionCard = ({ subscription, onConfirm, onIgnore }) => {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: subscription.color }}
          />
          <div>
            <h5 className="font-medium text-gray-900">{subscription.name}</h5>
            <p className="text-sm text-gray-600">{subscription.plan}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">
            {subscription.currency} {subscription.amount}
          </p>
          <p className="text-sm text-gray-600">
            信心度: {subscription.confidence}%
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
        <span>下次扣款: {subscription.renewalDate}</span>
        <span>分類: {subscription.category}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
        >
          <CheckCircle className="w-4 h-4" />
          確認新增
        </button>
        <button
          onClick={onIgnore}
          className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-400 transition-colors flex items-center justify-center gap-1"
        >
          <XCircle className="w-4 h-4" />
          忽略
        </button>
      </div>
    </div>
  );
};

export default GmailScanner;