import React from 'react';
import { ExternalLink, Copy, AlertCircle, CheckCircle } from 'lucide-react';
import { getSetupInstructions } from '../config/gmail';

const GmailSetupGuide = ({ onClose }) => {
  const instructions = getSetupInstructions();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('已複製到剪貼板！');
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 標題 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Gmail API 設定指引</h2>
                <p className="text-sm text-gray-600">需要完成 Google Cloud Console 設定</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* 警告訊息 */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800 mb-1">需要 Google API 憑證</h3>
                <p className="text-sm text-amber-700">
                  為了掃描您的 Gmail，需要先設定 Google OAuth 2.0 憑證。這是免費的，但需要幾個步驟。
                </p>
              </div>
            </div>
          </div>

          {/* 設定步驟 */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">📋 設定步驟</h3>
              <div className="space-y-3">
                {instructions.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Cloud Console 連結 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">Google Cloud Console</h4>
                  <p className="text-sm text-blue-700">前往 Google Cloud Console 開始設定</p>
                </div>
                <a
                  href="https://console.cloud.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                >
                  開啟 Console
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* 環境變數範例 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">📄 環境變數設定</h3>
              <p className="text-sm text-gray-600 mb-3">
                在專案根目錄建立 <code className="bg-gray-100 px-1 rounded">.env.local</code> 檔案：
              </p>
              
              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{instructions.envExample}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(instructions.envExample)}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-green-400 transition-colors"
                  title="複製到剪貼板"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 注意事項 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 mb-2">重要提醒</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• 設定完成後需要重新啟動開發伺服器</li>
                    <li>• Client ID 會顯示在瀏覽器中，這是正常的</li>
                    <li>• API Key 是選用的，主要用於提高配額</li>
                    <li>• 您的郵件資料不會離開瀏覽器</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 關閉按鈕 */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              我知道了
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GmailSetupGuide;