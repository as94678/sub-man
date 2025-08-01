import { GMAIL_CONFIG, validateGmailConfig } from '../config/gmail';

// Gmail API 前端服務 - 使用 Google Identity Services (GIS)
export class GmailService {
  constructor() {
    this.gapi = null;
    this.tokenClient = null;
    this.isInitialized = false;
    this.accessToken = null;
    this.config = GMAIL_CONFIG;
  }

  // 初始化 Google API - 使用 Google Identity Services
  async initialize() {
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        resolve(true);
        return;
      }

      // 檢查必要的 API 是否載入
      if (typeof window.gapi === 'undefined') {
        reject(new Error('Google API not loaded. Please add script tag to index.html'));
        return;
      }

      if (typeof window.google === 'undefined' || !window.google.accounts) {
        reject(new Error('Google Identity Services not loaded. Please add GSI script tag to index.html'));
        return;
      }

      // 驗證配置
      const configValidation = validateGmailConfig();
      if (!configValidation.isValid) {
        reject(new Error(configValidation.errors.join('; ')));
        return;
      }

      // 只載入 client，不載入 auth2
      window.gapi.load('client', async () => {
        try {
          const initConfig = {
            discoveryDocs: this.config.DISCOVERY_DOCS
          };

          // 如果有 API Key 就加入
          if (this.config.API_KEY) {
            initConfig.apiKey = this.config.API_KEY;
          }

          await window.gapi.client.init(initConfig);

          // 初始化 OAuth 2.0 token client (GIS)
          this.tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: this.config.CLIENT_ID,
            scope: this.config.SCOPES.join(' '),
            callback: (tokenResponse) => {
              this.accessToken = tokenResponse.access_token;
              console.log('Token received via callback');
            },
          });

          this.gapi = window.gapi;
          this.isInitialized = true;
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // 檢查是否已有 Gmail access token
  checkExistingGmailToken() {
    const gmailToken = localStorage.getItem('gmail_access_token');
    return !!gmailToken;
  }

  // 使用者授權 - 優先使用現有的 Gmail token
  async authorize() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.accessToken) {
      return true;
    }

    // 首先檢查是否已有 Gmail token（來自登入時取得的）
    const existingGmailToken = localStorage.getItem('gmail_access_token');
    if (existingGmailToken) {
      console.log('使用現有的 Gmail access token');
      this.accessToken = existingGmailToken;
      return true;
    }

    // 如果沒有現有 token，則需要重新授權
    console.log('沒有現有的 Gmail token，需要重新授權');
    
    return new Promise((resolve, reject) => {
      try {
        // 更新 callback 來處理這次的授權
        this.tokenClient.callback = (tokenResponse) => {
          if (tokenResponse.error) {
            reject(new Error(`授權失敗: ${tokenResponse.error}`));
            return;
          }
          
          this.accessToken = tokenResponse.access_token;
          // 儲存新的 token
          localStorage.setItem('gmail_access_token', tokenResponse.access_token);
          console.log('Gmail 授權成功');
          resolve(true);
        };

        // 請求存取權杖
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (error) {
        console.error('Authorization failed:', error);
        reject(new Error('使用者取消授權或授權失敗'));
      }
    });
  }

  // 搜尋訂閱相關郵件
  async searchSubscriptionEmails() {
    if (!this.accessToken) {
      throw new Error('未授權，請先進行 Gmail 授權');
    }

    const query = this.buildSearchQuery();
    
    try {
      const response = await this.gapi.client.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: 50,
        labelIds: ['INBOX']
      });

      const messages = response.result.messages || [];
      console.log(`找到 ${messages.length} 封可能的訂閱郵件`);

      return messages;
    } catch (error) {
      console.error('搜尋郵件失敗:', error);
      throw new Error('搜尋郵件失敗，請檢查網路連線');
    }
  }

  // 建立搜尋查詢字串
  buildSearchQuery() {
    const keywords = [
      'subscription', 'billing', 'invoice', 'renewal', 'payment',
      '訂閱', '帳單', '續約', '扣款', '付費', '會員'
    ];
    
    const services = [
      'Netflix', 'Spotify', 'YouTube', 'Disney+', 'Apple',
      'Amazon Prime', 'Microsoft', 'Adobe', 'Dropbox',
      'Office 365', 'iCloud', 'Google One'
    ];
    
    // 結合關鍵字和服務名稱
    const keywordQuery = `(${keywords.join(' OR ')})`;
    const serviceQuery = `(${services.join(' OR ')})`;
    
    return `${keywordQuery} AND ${serviceQuery}`;
  }

  // 獲取郵件詳細內容
  async getEmailDetails(messageId) {
    try {
      const response = await this.gapi.client.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });

      const message = response.result;
      const headers = message.payload.headers;

      return {
        id: messageId,
        date: new Date(parseInt(message.internalDate)),
        subject: this.getHeader(headers, 'Subject') || '',
        from: this.getHeader(headers, 'From') || '',
        body: this.extractEmailBody(message.payload)
      };
    } catch (error) {
      console.error(`獲取郵件 ${messageId} 失敗:`, error);
      return null;
    }
  }

  // 提取郵件標頭
  getHeader(headers, name) {
    const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : null;
  }

  // 提取郵件內容
  extractEmailBody(payload) {
    let body = '';

    if (payload.body && payload.body.data) {
      body = this.decodeBase64(payload.body.data);
    } else if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body && part.body.data) {
          body += this.decodeBase64(part.body.data);
        } else if (part.mimeType === 'text/html' && part.body && part.body.data) {
          // 簡單的 HTML 轉文字
          const htmlContent = this.decodeBase64(part.body.data);
          body += this.stripHtml(htmlContent);
        }
      }
    }

    return body;
  }

  // Base64 解碼
  decodeBase64(data) {
    try {
      // Gmail API 使用 URL-safe base64
      const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
      return decodeURIComponent(escape(atob(base64)));
    } catch (error) {
      console.error('Base64 解碼失敗:', error);
      return '';
    }
  }

  // 簡單的 HTML 標籤移除
  stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  // 登出 - 使用 Google Identity Services
  async signOut() {
    if (this.accessToken && window.google && window.google.accounts && window.google.accounts.oauth2) {
      // 撤銷存取權杖
      window.google.accounts.oauth2.revoke(this.accessToken, () => {
        console.log('Access token revoked');
      });
    }
    this.accessToken = null;
  }

  // 檢查是否已授權
  isSignedIn() {
    return !!this.accessToken;
  }
}