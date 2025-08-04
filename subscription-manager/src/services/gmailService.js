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

          // 如果有 API Key 就加入（雖然使用 OAuth token 時不是必需的）
          if (this.config.API_KEY) {
            initConfig.apiKey = this.config.API_KEY;
          }

          await window.gapi.client.init(initConfig);
          console.log('Gmail API 初始化成功');

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
      console.log('使用現有的 Gmail access token:', existingGmailToken.substring(0, 20) + '...');
      this.accessToken = existingGmailToken;
      
      // 立即設定 token 給 gapi client
      this.gapi.client.setToken({
        access_token: this.accessToken
      });
      console.log('已設定 access token 給 gapi client');
      
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

  // 搜尋訂閱相關郵件 - 支援分頁搜尋
  async searchSubscriptionEmails(maxPages = 3) {
    if (!this.accessToken) {
      throw new Error('未授權，請先進行 Gmail 授權');
    }

    // 設定 access token 給 gapi client
    this.gapi.client.setToken({
      access_token: this.accessToken
    });

    const query = this.buildSearchQuery();
    let allMessages = [];
    let pageToken = null;
    let currentPage = 0;
    
    try {
      do {
        currentPage++;
        console.log(`正在搜尋第 ${currentPage} 頁郵件...`);
        
        const requestParams = {
          userId: 'me',
          q: query,
          maxResults: 50,
          labelIds: ['INBOX']
        };
        
        if (pageToken) {
          requestParams.pageToken = pageToken;
        }

        const response = await this.gapi.client.gmail.users.messages.list(requestParams);
        const messages = response.result.messages || [];
        
        console.log(`第 ${currentPage} 頁找到 ${messages.length} 封郵件`);
        allMessages = allMessages.concat(messages);
        
        pageToken = response.result.nextPageToken;
        
        // 如果已經找到足夠的郵件或達到最大頁數限制，就停止搜尋
        if (allMessages.length >= 100 || currentPage >= maxPages) {
          break;
        }
        
      } while (pageToken && currentPage < maxPages);

      console.log(`總共找到 ${allMessages.length} 封可能的訂閱郵件`);
      return allMessages;
      
    } catch (error) {
      console.error('搜尋郵件失敗:', error);
      
      // 如果是 401 錯誤，嘗試重新授權
      if (error.status === 401) {
        console.log('Access token 可能已過期，嘗試重新授權');
        // 清除過期的 token
        localStorage.removeItem('gmail_access_token');
        this.accessToken = null;
        throw new Error('授權已過期，請重新嘗試');
      }
      
      throw new Error('搜尋郵件失敗，請檢查網路連線');
    }
  }

  // 建立搜尋查詢字串 - 一個月內的訂閱相關郵件
  buildSearchQuery() {
    // 計算一個月前的日期
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const dateString = oneMonthAgo.toISOString().split('T')[0].replace(/-/g, '/');

    // 特定發件人過濾 - 優先搜尋可信的發件人
    const trustedSenders = [
      'from:"Anthropic, PBC"',
      'from:noreply@anthropic.com',
      'from:billing@anthropic.com',
      'from:support@anthropic.com'
    ];

    // 廣泛的訂閱相關關鍵詞
    const subscriptionKeywords = [
      'subscription', 'billing', 'invoice', 'receipt', 'payment', 'charged',
      'renewal', 'renew', 'monthly', 'plan', 'membership', 'premium',
      'your payment', 'payment confirmation', 'bill', 'transaction',
      'auto-renewal', 'automatic', 'recurring', 'charge', 'debit',
      '訂閱', '帳單', '付款', '扣款', '續費', '會員', '月費', '年費',
      '自動續費', '自動扣款', '定期付款', '定期扣款', '會員費用',
      '订阅', '账单', '付费', '扣费', '续费', '会员费', '包月', '包年'
    ];

    // 服務相關詞彙
    const serviceIndicators = [
      'service', 'account', 'pro', 'plus', 'premium', 'upgrade',
      'plan', 'tier', 'package', 'bundle', 'family', 'individual',
      'team', 'business', 'enterprise', 'student', 'personal'
    ];

    // 知名訂閱服務名稱
    const popularServices = [
      'netflix', 'spotify', 'youtube', 'disney', 'apple', 'google',
      'microsoft', 'adobe', 'amazon', 'prime', 'dropbox', 'icloud',
      'office365', 'notion', 'github', 'anthropic', 'openai', 'chatgpt',
      'claude', 'canva', 'figma', 'slack', 'zoom', 'teams'
    ];

    // 訂閱服務常見發件人域名模式
    const commonDomains = [
      'from:noreply@', 'from:no-reply@', 'from:billing@', 'from:support@',
      'from:account@', 'from:notifications@', 'from:invoice@', 'from:receipts@'
    ];

    // 支付平台關鍵詞
    const paymentPlatforms = [
      'paypal', 'stripe', 'visa', 'mastercard', 'amex', 'discover',
      'apple pay', 'google pay', '信用卡', '金融卡', '付費平台'
    ];

    // 建立查詢 - 優先搜尋可信發件人，然後是一般訂閱郵件
    const trustedSenderQuery = `(${trustedSenders.join(' OR ')})`;
    const keywordQuery = `(${subscriptionKeywords.join(' OR ')})`;
    const serviceQuery = `(${serviceIndicators.join(' OR ')})`;
    const servicesQuery = `(${popularServices.join(' OR ')})`;
    const domainQuery = `(${commonDomains.join(' OR ')})`;
    const paymentQuery = `(${paymentPlatforms.join(' OR ')})`;
    
    // 優先搜尋可信發件人的郵件，如果沒有再搜尋其他訂閱相關郵件
    return `after:${dateString} (${trustedSenderQuery} OR (${keywordQuery} OR ${serviceQuery} OR ${servicesQuery} OR ${domainQuery} OR ${paymentQuery}))`;
  }

  // 獲取郵件詳細內容
  async getEmailDetails(messageId) {
    try {
      // 確保 access token 已設定
      if (this.accessToken) {
        this.gapi.client.setToken({
          access_token: this.accessToken
        });
      }

      const response = await this.gapi.client.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });

      const message = response.result;
      
      // 輸出原始 JSON 結構供調試
      console.log(`🔍 郵件 ${messageId} 原始結構:`, {
        id: message.id,
        snippet: message.snippet,
        payload: {
          headers: message.payload.headers,
          body: message.payload.body,
          parts: message.payload.parts,
          mimeType: message.payload.mimeType
        },
        internalDate: message.internalDate
      });

      const headers = message.payload.headers;

      const emailDate = new Date(parseInt(message.internalDate));
      
      return {
        id: messageId,
        date: emailDate,
        receivedDate: emailDate.toISOString().split('T')[0], // 格式化為 YYYY-MM-DD
        receivedTime: emailDate.toLocaleString('zh-TW'), // 本地化時間顯示
        subject: this.getHeader(headers, 'Subject') || '',
        from: this.getHeader(headers, 'From') || '',
        body: this.extractEmailBody(message.payload),
        rawMessage: message // 保留原始訊息供進階調試
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