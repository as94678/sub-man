// 學習數據管理組件 - 讓用戶查看和管理已學習的服務

import React, { useState, useEffect } from 'react';
import { Trash2, BarChart3, Users, Star, RefreshCw, Download, Upload } from 'lucide-react';
import { userLearnedServices } from '../../data/enhancedSubscriptionServices';
import { enhancedServiceSearch } from '../../utils/enhancedServiceSearch';

const LearningDataManager = ({ darkMode = false, onClose }) => {
  const [learnedServices, setLearnedServices] = useState([]);
  const [usageStats, setUsageStats] = useState({});
  const [searchStats, setSearchStats] = useState({});
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // 載入數據
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setLearnedServices(userLearnedServices.learnedServices);
    setUsageStats(userLearnedServices.usageStats);
    setSearchStats(enhancedServiceSearch.getSearchStats());
  };

  // 刪除單個學習服務
  const handleDeleteService = (serviceId) => {
    const updatedServices = learnedServices.filter(service => service.id !== serviceId);
    userLearnedServices.learnedServices = updatedServices;
    userLearnedServices.saveLearnedServices();
    refreshData();
  };

  // 清除所有學習數據
  const handleClearAllData = () => {
    if (showConfirmClear) {
      userLearnedServices.clearLearnedData();
      refreshData();
      setShowConfirmClear(false);
    } else {
      setShowConfirmClear(true);
      setTimeout(() => setShowConfirmClear(false), 5000); // 5秒後自動取消
    }
  };

  // 導出學習數據
  const handleExportData = () => {
    const exportData = {
      learnedServices: learnedServices,
      usageStats: usageStats,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `subscription-learning-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // 導入學習數據
  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        if (importData.learnedServices && Array.isArray(importData.learnedServices)) {
          // 合併數據而不是替換
          const existingIds = new Set(learnedServices.map(s => s.id));
          const newServices = importData.learnedServices.filter(s => !existingIds.has(s.id));
          
          userLearnedServices.learnedServices = [...learnedServices, ...newServices];
          userLearnedServices.saveLearnedServices();
          
          if (importData.usageStats) {
            // 合併使用統計
            const mergedStats = { ...usageStats, ...importData.usageStats };
            userLearnedServices.usageStats = mergedStats;
            userLearnedServices.saveUsageStats();
          }
          
          refreshData();
          alert(`成功導入 ${newServices.length} 個新服務！`);
        }
      } catch (error) {
        alert('導入失敗：文件格式不正確');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    
    // 清除文件選擇
    event.target.value = '';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '未知';
    return new Date(timestamp).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* 標題欄 */}
        <div className={`sticky top-0 p-6 border-b ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">學習數據管理</h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  管理和查看您的服務學習記錄
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
          {/* 統計摘要 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-blue-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Users className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className="text-sm font-medium">學習的服務</span>
              </div>
              <div className="text-2xl font-bold">{searchStats.userLearnedServices || 0}</div>
            </div>

            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-green-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Star className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <span className="text-sm font-medium">內建服務</span>
              </div>
              <div className="text-2xl font-bold">{searchStats.totalServices || 0}</div>
            </div>

            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-purple-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <span className="text-sm font-medium">使用記錄</span>
              </div>
              <div className="text-2xl font-bold">{searchStats.totalUsageRecords || 0}</div>
            </div>

            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-orange-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className={`w-4 h-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                <span className="text-sm font-medium">總服務數</span>
              </div>
              <div className="text-2xl font-bold">
                {(searchStats.totalServices || 0) + (searchStats.userLearnedServices || 0)}
              </div>
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={refreshData}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              刷新數據
            </button>

            <button
              onClick={handleExportData}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <Download className="w-4 h-4" />
              導出數據
            </button>

            <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              darkMode 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}>
              <Upload className="w-4 h-4" />
              導入數據
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>

            <button
              onClick={handleClearAllData}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showConfirmClear
                  ? 'bg-red-600 text-white'
                  : darkMode 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              {showConfirmClear ? '確認清除全部' : '清除全部'}
            </button>
          </div>

          {/* 學習的服務列表 */}
          {learnedServices.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">學習的服務 ({learnedServices.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {learnedServices
                  .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
                  .map((service) => (
                    <div
                      key={service.id}
                      className={`flex items-center p-4 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {/* 服務圖標 */}
                      <div 
                        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4"
                        style={{ backgroundColor: `${service.color}20`, color: service.color }}
                      >
                        <i className={service.icon}></i>
                      </div>

                      {/* 服務信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">{service.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {service.category}
                          </span>
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          使用 {service.usageCount || 0} 次 • 
                          創建於 {formatDate(service.createdAt)} • 
                          最後使用 {formatDate(service.lastUsed)}
                        </div>
                        {service.pricing && service.pricing.length > 0 && (
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            預設價格: {service.pricing[0].currency} {service.pricing[0].price}
                          </div>
                        )}
                      </div>

                      {/* 操作按鈕 */}
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode 
                            ? 'text-red-400 hover:bg-red-900 hover:text-red-300' 
                            : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                        }`}
                        title="刪除此服務"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className={`text-center py-12 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">還沒有學習到任何服務</p>
              <p className="text-sm">
                當您手動輸入新的服務名稱時，系統會自動學習並記錄
              </p>
            </div>
          )}

          {/* 使用統計 */}
          {searchStats.mostUsedServices && searchStats.mostUsedServices.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">使用頻率統計</h3>
              <div className="space-y-2">
                {searchStats.mostUsedServices.map((stat, index) => (
                  <div
                    key={stat.name}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium w-6 text-center ${
                        index === 0 ? 'text-yellow-500' : 
                        index === 1 ? 'text-gray-400' : 
                        index === 2 ? 'text-orange-600' : 
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        #{index + 1}
                      </span>
                      <span className="font-medium">{stat.name}</span>
                    </div>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.count} 次
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningDataManager;