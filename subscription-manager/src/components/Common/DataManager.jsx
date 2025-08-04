// 數據匯出/匯入管理組件 - 讓用戶備份和恢復數據

import React, { useState } from 'react';
import { Download, Upload, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { userLearnedServices } from '../../data/enhancedSubscriptionServices';

const DataManager = ({ 
  subscriptions = [], 
  onImportComplete,
  darkMode = false,
  onClose 
}) => {
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  // 匯出所有數據
  const handleExportData = () => {
    try {
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        appName: 'Subscription Manager',
        data: {
          subscriptions: subscriptions,
          learnedServices: userLearnedServices.learnedServices,
          usageStats: userLearnedServices.usageStats,
          settings: {
            // 可以從localStorage讀取其他設定
            theme: localStorage.getItem('theme') || 'light',
            currency: localStorage.getItem('baseCurrency') || 'USD'
          }
        },
        metadata: {
          totalSubscriptions: subscriptions.length,
          totalLearnedServices: userLearnedServices.learnedServices.length,
          exportSource: 'web-app'
        }
      };

      // 創建下載檔案
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      
      const fileName = `subscription-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 清理URL對象
      URL.revokeObjectURL(link.href);
      
      setImportStatus({
        type: 'success',
        message: `數據已成功匯出到 ${fileName}`
      });

    } catch (error) {
      console.error('Export failed:', error);
      setImportStatus({
        type: 'error',
        message: '匯出失敗：' + error.message
      });
    }
  };

  // 匯入數據
  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    setImportStatus(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        // 驗證數據格式
        if (!importData.data) {
          throw new Error('不正確的檔案格式：缺少數據區塊');
        }

        let importResults = {
          subscriptions: 0,
          learnedServices: 0,
          settings: 0,
          errors: []
        };

        // 匯入訂閱數據
        if (importData.data.subscriptions && Array.isArray(importData.data.subscriptions)) {
          // 這裡需要調用父組件的回調來更新訂閱數據
          if (onImportComplete) {
            onImportComplete('subscriptions', importData.data.subscriptions);
            importResults.subscriptions = importData.data.subscriptions.length;
          }
        }

        // 匯入學習服務
        if (importData.data.learnedServices && Array.isArray(importData.data.learnedServices)) {
          // 合併學習服務（避免重複）
          const existingIds = new Set(userLearnedServices.learnedServices.map(s => s.id));
          const newServices = importData.data.learnedServices.filter(s => !existingIds.has(s.id));
          
          userLearnedServices.learnedServices = [
            ...userLearnedServices.learnedServices,
            ...newServices
          ];
          userLearnedServices.saveLearnedServices();
          importResults.learnedServices = newServices.length;
        }

        // 匯入使用統計
        if (importData.data.usageStats) {
          const mergedStats = { 
            ...userLearnedServices.usageStats, 
            ...importData.data.usageStats 
          };
          userLearnedServices.usageStats = mergedStats;
          userLearnedServices.saveUsageStats();
        }

        // 匯入設定
        if (importData.data.settings) {
          if (importData.data.settings.theme) {
            localStorage.setItem('theme', importData.data.settings.theme);
            importResults.settings++;
          }
          if (importData.data.settings.currency) {
            localStorage.setItem('baseCurrency', importData.data.settings.currency);
            importResults.settings++;
          }
        }

        // 顯示匯入結果
        const messages = [];
        if (importResults.subscriptions > 0) {
          messages.push(`${importResults.subscriptions} 個訂閱`);
        }
        if (importResults.learnedServices > 0) {
          messages.push(`${importResults.learnedServices} 個學習服務`);
        }
        if (importResults.settings > 0) {
          messages.push(`${importResults.settings} 個設定`);
        }

        if (messages.length > 0) {
          setImportStatus({
            type: 'success',
            message: `成功匯入：${messages.join('、')}`
          });
        } else {
          setImportStatus({
            type: 'warning',
            message: '未匯入任何新數據（可能數據已存在）'
          });
        }

      } catch (error) {
        console.error('Import failed:', error);
        setImportStatus({
          type: 'error',
          message: '匯入失敗：' + error.message
        });
      } finally {
        setImporting(false);
      }
    };

    reader.onerror = () => {
      setImportStatus({
        type: 'error',
        message: '檔案讀取失敗'
      });
      setImporting(false);
    };

    reader.readAsText(file);
    
    // 清除檔案選擇
    event.target.value = '';
  };

  // 重置所有數據
  const handleResetAllData = () => {
    if (window.confirm('⚠️ 確定要清除所有數據嗎？此動作無法復原！\n\n建議先匯出備份。')) {
      if (window.confirm('🚨 最後確認：這將清除所有訂閱、學習服務和設定！')) {
        try {
          // 清除所有localStorage數據
          localStorage.clear();
          
          // 重置學習服務
          userLearnedServices.clearLearnedData();
          
          // 通知父組件重置
          if (onImportComplete) {
            onImportComplete('reset', null);
          }
          
          setImportStatus({
            type: 'success',
            message: '所有數據已清除，頁面將重新載入'
          });
          
          // 延遲重新載入頁面
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          
        } catch (error) {
          setImportStatus({
            type: 'error',
            message: '清除數據時發生錯誤：' + error.message
          });
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-xl max-w-2xl w-full ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* 標題欄 */}
        <div className={`p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <RefreshCw className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">數據管理</h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  備份、恢復或管理您的訂閱數據
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`text-2xl hover:opacity-70 transition-opacity ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 狀態顯示 */}
          {importStatus && (
            <div className={`p-4 rounded-lg flex items-start gap-3 ${
              importStatus.type === 'success' 
                ? darkMode ? 'bg-green-900 text-green-100' : 'bg-green-50 text-green-800'
                : importStatus.type === 'warning'
                ? darkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-50 text-yellow-800'
                : darkMode ? 'bg-red-900 text-red-100' : 'bg-red-50 text-red-800'
            }`}>
              {importStatus.type === 'success' && <CheckCircle className="w-5 h-5 mt-0.5" />}
              {importStatus.type === 'warning' && <AlertTriangle className="w-5 h-5 mt-0.5" />}
              {importStatus.type === 'error' && <AlertTriangle className="w-5 h-5 mt-0.5" />}
              <div>
                <p className="font-medium">{importStatus.message}</p>
              </div>
            </div>
          )}

          {/* 當前數據概覽 */}
          <div className={`p-4 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              當前數據概覽
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>訂閱服務：</span>
                <span className="font-medium ml-2">{subscriptions.length}</span>
              </div>
              <div>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>學習服務：</span>
                <span className="font-medium ml-2">{userLearnedServices.learnedServices.length}</span>
              </div>
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="space-y-4">
            {/* 匯出數據 */}
            <button
              onClick={handleExportData}
              className={`w-full flex items-center justify-center gap-3 p-4 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Download className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">匯出所有數據</div>
                <div className="text-sm opacity-90">下載JSON備份檔案</div>
              </div>
            </button>

            {/* 匯入數據 */}
            <label className={`w-full flex items-center justify-center gap-3 p-4 rounded-lg cursor-pointer transition-colors ${
              importing 
                ? darkMode ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-400 cursor-not-allowed'
                : darkMode 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
            }`}>
              <Upload className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">
                  {importing ? '匯入中...' : '匯入數據'}
                </div>
                <div className="text-sm opacity-90">選擇JSON備份檔案</div>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                disabled={importing}
                className="hidden"
              />
            </label>

            {/* 危險區域 */}
            <div className={`border rounded-lg p-4 ${
              darkMode ? 'border-red-800 bg-red-900/20' : 'border-red-200 bg-red-50'
            }`}>
              <h4 className={`font-medium mb-2 flex items-center gap-2 ${
                darkMode ? 'text-red-400' : 'text-red-700'
              }`}>
                <AlertTriangle className="w-4 h-4" />
                危險操作
              </h4>
              <button
                onClick={handleResetAllData}
                className={`w-full p-3 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                清除所有數據
              </button>
              <p className={`text-xs mt-2 ${
                darkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                ⚠️ 此操作將清除所有訂閱、學習服務和設定，無法復原
              </p>
            </div>
          </div>

          {/* 使用說明 */}
          <div className={`text-xs space-y-2 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <p><strong>💡 使用建議：</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>定期匯出數據作為備份</li>
              <li>換裝置時可匯入之前的備份</li>
              <li>匯入時會自動合併數據，不會覆蓋現有數據</li>
              <li>建議在清除數據前先匯出備份</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManager;