// Gmail API 配置 - Vite 版本

// Vite 使用 import.meta.env 而不是 process.env
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const GMAIL_CONFIG = {
  CLIENT_ID,
  API_KEY,
  SCOPES: ['https://www.googleapis.com/auth/gmail.readonly'],
  DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest']
};

// 驗證配置
export function validateGmailConfig() {
  const errors = [];
  
  if (!GMAIL_CONFIG.CLIENT_ID) {
    errors.push('缺少 Google Client ID。請設定 VITE_GOOGLE_CLIENT_ID 環境變數。');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    config: GMAIL_CONFIG
  };
}

// 獲取設定指引
export function getSetupInstructions() {
  return {
    steps: [
      '1. 前往 Google Cloud Console (https://console.cloud.google.com/)',
      '2. 建立新專案或選擇現有專案',
      '3. 啟用 Gmail API',
      '4. 建立 OAuth 2.0 憑證 (Web application)',
      '5. 設定授權重新導向 URI: http://localhost:3000',
      '6. 複製 Client ID',
      '7. 在專案根目錄建立 .env.local 檔案',
      '8. 加入: VITE_GOOGLE_CLIENT_ID=你的_client_id'
    ],
    envExample: `# .env.local
VITE_GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q (選用)`
  };
}

// Debug 函數
export function debugConfig() {
  console.log('Gmail Config Debug:', {
    CLIENT_ID: GMAIL_CONFIG.CLIENT_ID ? '已設定' : '未設定',
    API_KEY: GMAIL_CONFIG.API_KEY ? '已設定' : '未設定',
    validation: validateGmailConfig()
  });
}