// 郵件模式識別和解析引擎
export const subscriptionPatterns = {
  netflix: {
    senders: ['info@account.netflix.com', 'noreply@netflix.com', 'info@netflix.com'],
    keywords: ['netflix'],
    subjects: ['Netflix', '您的 Netflix', 'Your Netflix membership', '會員資格'],
    patterns: {
      amount: [
        /NT\$(\d+)/gi,
        /USD\s*\$(\d+\.?\d*)/gi,
        /(\d+).*?元/gi
      ],
      renewal: [
        /(\d{1,2}).*?日.*?扣款/gi,
        /(\d{1,2}).*?號.*?扣款/gi,
        /will.*?charge.*?on.*?(\d{1,2})/gi,
        /renewal.*?date.*?(\d{1,2})/gi
      ],
      plan: [
        /(家庭|標準|基本|Premium|Standard|Basic|高級).*?方案/gi,
        /(Family|Individual|Premium|Standard|Basic)/gi
      ]
    },
    defaultAmount: { TWD: 390, USD: 15.49 },
    category: 'entertainment',
    color: '#E50914'
  },

  spotify: {
    senders: ['noreply@spotify.com', 'support@spotify.com'],
    keywords: ['spotify'],
    subjects: ['Spotify Premium', 'Spotify', '付費會員'],
    patterns: {
      amount: [
        /NT\$(\d+)/gi,
        /USD\s*\$(\d+\.?\d*)/gi
      ],
      renewal: [
        /(\d{1,2}).*?日.*?付款/gi,
        /(\d{1,2}).*?號.*?續訂/gi,
        /next.*?payment.*?(\d{1,2})/gi
      ],
      plan: [
        /(Premium|Individual|Family|Student|個人|家庭|學生)/gi
      ]
    },
    defaultAmount: { TWD: 149, USD: 9.99 },
    category: 'music',
    color: '#1DB954'
  },

  youtube: {
    senders: ['noreply@youtube.com', 'youtube-noreply@google.com'],
    keywords: ['youtube'],
    subjects: ['YouTube Premium', 'YouTube Music', 'YouTube 會員'],
    patterns: {
      amount: [
        /NT\$(\d+)/gi,
        /USD\s*\$(\d+\.?\d*)/gi
      ],
      renewal: [
        /(\d{1,2}).*?日.*?續訂/gi,
        /(\d{1,2}).*?號.*?付款/gi
      ]
    },
    defaultAmount: { TWD: 179, USD: 11.99 },
    category: 'entertainment',
    color: '#FF0000'
  },

  disney: {
    senders: ['help@disneyplus.com', 'noreply@disneyplus.com'],
    keywords: ['disney'],
    subjects: ['Disney+', 'Disney Plus'],
    patterns: {
      amount: [
        /NT\$(\d+)/gi,
        /USD\s*\$(\d+\.?\d*)/gi
      ],
      renewal: [
        /(\d{1,2}).*?日.*?扣款/gi
      ]
    },
    defaultAmount: { TWD: 270, USD: 7.99 },
    category: 'entertainment',
    color: '#113CCF'
  },

  apple: {
    senders: ['noreply@email.apple.com', 'do_not_reply@apple.com'],
    keywords: ['apple', 'icloud', 'app store'],
    subjects: ['Apple', 'iCloud', 'App Store'],
    patterns: {
      amount: [
        /NT\$(\d+)/gi,
        /USD\s*\$(\d+\.?\d*)/gi
      ],
      renewal: [
        /(\d{1,2}).*?日.*?續訂/gi
      ]
    },
    defaultAmount: { TWD: 30, USD: 0.99 },
    category: 'cloud',
    color: '#007AFF'
  },

  claude: {
    senders: ['invoice+statements@mail.anthropic.com', 'noreply@anthropic.com', '"Anthropic, PBC"'],
    keywords: ['anthropic', 'claude'],
    subjects: ['Your receipt from Anthropic', 'Anthropic', 'Claude', 'receipt from Anthropic, PBC'],
    patterns: {
      amount: [
        /\$(\d+\.?\d*)/gi,
        /USD\s*\$?(\d+\.?\d*)/gi,
        /(\d+\.\d{2})\s*USD/gi,
        /Amount paid\s*\$(\d+\.?\d*)/gi,
        /Total\s*\$(\d+\.?\d*)/gi
      ],
      renewal: [
        /next.*?billing.*?(\d{1,2})/gi,
        /renew.*?on.*?(\d{1,2})/gi,
        /billing.*?cycle.*?(\d{1,2})/gi,
        /(\w{3})\s+(\d{1,2})\s*–\s*(\w{3})\s+(\d{1,2})/gi
      ],
      plan: [
        /(Claude Pro|Claude Team|Claude Enterprise)/gi,
        /Claude\s+(Pro|Team|Enterprise|Plus)/gi
      ],
      serviceName: [
        /(Claude Pro|Claude Team|Claude Enterprise)/gi,
        /Claude\s+(Pro|Team|Enterprise|Plus)/gi
      ]
    },
    defaultAmount: { USD: 20.00 },
    category: 'ai',
    color: '#D97706'
  },

  openai: {
    senders: ['noreply@openai.com', 'billing@openai.com'],
    keywords: ['openai', 'chatgpt'],
    subjects: ['OpenAI', 'ChatGPT', 'Your ChatGPT Plus'],
    patterns: {
      amount: [
        /\$(\d+\.?\d*)/gi,
        /USD\s*\$?(\d+\.?\d*)/gi
      ],
      renewal: [
        /next.*?billing.*?(\d{1,2})/gi,
        /renew.*?on.*?(\d{1,2})/gi
      ]
    },
    defaultAmount: { USD: 20.00 },
    category: 'ai',
    color: '#00A67E'
  },

  notion: {
    senders: ['team@makenotion.com', 'noreply@notion.so'],
    keywords: ['notion'],
    subjects: ['Notion', 'Your Notion subscription'],
    patterns: {
      amount: [
        /\$(\d+\.?\d*)/gi,
        /USD\s*\$?(\d+\.?\d*)/gi
      ],
      renewal: [
        /next.*?billing.*?(\d{1,2})/gi
      ]
    },
    defaultAmount: { USD: 8.00 },
    category: 'productivity',
    color: '#000000'
  },

  github: {
    senders: ['noreply@github.com', 'billing@github.com'],
    keywords: ['github'],
    subjects: ['GitHub', 'Your GitHub subscription'],
    patterns: {
      amount: [
        /\$(\d+\.?\d*)/gi,
        /USD\s*\$?(\d+\.?\d*)/gi
      ],
      renewal: [
        /next.*?billing.*?(\d{1,2})/gi
      ]
    },
    defaultAmount: { USD: 4.00 },
    category: 'development',
    color: '#181717'
  },

  // 新增更多訂閱服務

  adobe: {
    senders: ['mail@adobe.com', 'noreply@adobe.com', 'invoice@adobe.com'],
    keywords: ['adobe', 'creative cloud'],
    subjects: ['Adobe', 'Creative Cloud', 'Your Adobe subscription'],
    patterns: {
      amount: [
        /NT\$(\d+)/gi,
        /USD\s*\$(\d+\.?\d*)/gi,
        /\$(\d+\.?\d*)/gi
      ],
      renewal: [
        /next.*?billing.*?(\d{1,2})/gi,
        /renew.*?on.*?(\d{1,2})/gi
      ]
    },
    defaultAmount: { TWD: 672, USD: 20.99 },
    category: 'design',
    color: '#FF0000'
  },

  microsoft: {
    senders: ['msonlineservicesteam@microsoftonline.com', 'noreply@microsoft.com'],
    keywords: ['microsoft', 'office 365', 'outlook', 'onedrive'],
    subjects: ['Microsoft', 'Office 365', 'Your Microsoft subscription'],
    patterns: {
      amount: [
        /NT\$(\d+)/gi,
        /USD\s*\$(\d+\.?\d*)/gi,
        /\$(\d+\.?\d*)/gi
      ],
      renewal: [
        /next.*?billing.*?(\d{1,2})/gi
      ]
    },
    defaultAmount: { TWD: 219, USD: 6.99 },
    category: 'productivity',
    color: '#0078D4'
  },

  amazon: {
    senders: ['digital-no-reply@amazon.com', 'auto-confirm@amazon.com'],
    keywords: ['amazon', 'prime'],
    subjects: ['Amazon Prime', 'Amazon', 'Prime Video'],
    patterns: {
      amount: [
        /NT\$(\d+)/gi,
        /USD\s*\$(\d+\.?\d*)/gi,
        /\$(\d+\.?\d*)/gi
      ],
      renewal: [
        /next.*?billing.*?(\d{1,2})/gi,
        /membership.*?renew.*?(\d{1,2})/gi
      ]
    },
    defaultAmount: { TWD: 170, USD: 14.99 },
    category: 'entertainment',
    color: '#FF9900'
  },

  dropbox: {
    senders: ['no-reply@dropbox.com', 'noreply@dropbox.com'],
    keywords: ['dropbox'],
    subjects: ['Dropbox', 'Your Dropbox subscription'],
    patterns: {
      amount: [
        /\$(\d+\.?\d*)/gi,
        /USD\s*\$?(\d+\.?\d*)/gi
      ],
      renewal: [
        /next.*?billing.*?(\d{1,2})/gi
      ]
    },
    defaultAmount: { USD: 9.99 },
    category: 'cloud',
    color: '#0061FF'
  },

  canva: {
    senders: ['hello@canva.com', 'noreply@canva.com'],
    keywords: ['canva'],
    subjects: ['Canva', 'Your Canva Pro subscription'],
    patterns: {
      amount: [
        /\$(\d+\.?\d*)/gi,
        /USD\s*\$?(\d+\.?\d*)/gi
      ],
      renewal: [
        /next.*?billing.*?(\d{1,2})/gi
      ]
    },
    defaultAmount: { USD: 12.99 },
    category: 'design',
    color: '#00C4CC'
  },

  figma: {
    senders: ['no-reply@figma.com', 'billing@figma.com'],
    keywords: ['figma'],
    subjects: ['Figma', 'Your Figma subscription'],
    patterns: {
      amount: [
        /\$(\d+\.?\d*)/gi,
        /USD\s*\$?(\d+\.?\d*)/gi
      ],
      renewal: [
        /next.*?billing.*?(\d{1,2})/gi
      ]
    },
    defaultAmount: { USD: 12.00 },
    category: 'design',
    color: '#F24E1E'
  },

  slack: {
    senders: ['feedback@slack.com', 'noreply@slack.com'],
    keywords: ['slack'],
    subjects: ['Slack', 'Your Slack subscription'],
    patterns: {
      amount: [
        /\$(\d+\.?\d*)/gi,
        /USD\s*\$?(\d+\.?\d*)/gi
      ],
      renewal: [
        /next.*?billing.*?(\d{1,2})/gi
      ]
    },
    defaultAmount: { USD: 6.67 },
    category: 'productivity',
    color: '#4A154B'
  },

  zoom: {
    senders: ['no-reply@zoom.us', 'noreply@zoom.us'],
    keywords: ['zoom'],
    subjects: ['Zoom', 'Your Zoom subscription'],
    patterns: {
      amount: [
        /\$(\d+\.?\d*)/gi,
        /USD\s*\$?(\d+\.?\d*)/gi
      ],
      renewal: [
        /next.*?billing.*?(\d{1,2})/gi
      ]
    },
    defaultAmount: { USD: 14.99 },
    category: 'productivity',
    color: '#2D8CFF'
  },

  // 通用訂閱模式 - 當無法識別特定服務時使用
  generic: {
    senders: [],
    keywords: ['subscription', 'billing', 'payment', 'renewal', '訂閱', '帳單', '付款'],
    subjects: [],
    patterns: {
      amount: [
        /NT\$(\d+)/gi,
        /USD\s*\$(\d+\.?\d*)/gi,
        /\$(\d+\.?\d*)/gi,
        /(\d+).*?元/gi,
        /(\d+\.\d{2})/gi
      ],
      renewal: [
        /(\d{1,2}).*?日.*?(扣款|付款|續費)/gi,
        /(\d{1,2}).*?號.*?(扣款|付款|續費)/gi,
        /next.*?billing.*?(\d{1,2})/gi,
        /renewal.*?date.*?(\d{1,2})/gi,
        /charge.*?on.*?(\d{1,2})/gi
      ]
    },
    defaultAmount: { TWD: 100, USD: 9.99 },
    category: 'other',
    color: '#6B7280'
  }
};

// 通用解析工具
export class EmailParser {
  static identifyService(sender, subject, body = '') {
    const text = `${sender} ${subject} ${body}`.toLowerCase();
    
    // 首先檢查特定服務（排除通用模式）
    for (const [serviceKey, config] of Object.entries(subscriptionPatterns)) {
      if (serviceKey === 'generic') continue; // 跳過通用模式
      
      // 檢查寄件者
      if (config.senders.some(senderPattern => 
        sender.toLowerCase().includes(senderPattern.toLowerCase())
      )) {
        return serviceKey;
      }
      
      // 檢查關鍵字
      if (config.keywords.some(keyword => text.includes(keyword))) {
        return serviceKey;
      }
    }
    
    // 如果無法識別特定服務，檢查是否符合通用訂閱模式
    const genericConfig = subscriptionPatterns.generic;
    if (genericConfig.keywords.some(keyword => text.includes(keyword))) {
      // 額外檢查是否包含金額或日期資訊，提高準確度
      const hasAmount = genericConfig.patterns.amount.some(pattern => pattern.test(text));
      const hasDate = genericConfig.patterns.renewal.some(pattern => pattern.test(text));
      
      if (hasAmount || hasDate) {
        return 'generic';
      }
    }
    
    return null;
  }

  static extractAmount(text, patterns) {
    for (const pattern of patterns.amount) {
      const matches = text.match(pattern);
      if (matches) {
        const amount = parseFloat(matches[1]);
        if (!isNaN(amount)) {
          return amount;
        }
      }
    }
    return null;
  }

  static extractRenewalDate(text, patterns) {
    for (const pattern of patterns.renewal) {
      const matches = text.match(pattern);
      if (matches) {
        const day = parseInt(matches[1]);
        if (day >= 1 && day <= 31) {
          return this.calculateNextRenewalDate(day);
        }
      }
    }
    return null;
  }

  static extractPlan(text, patterns) {
    if (!patterns.plan) return null;
    
    for (const pattern of patterns.plan) {
      const matches = text.match(pattern);
      if (matches) {
        return matches[1] || matches[0];
      }
    }
    return null;
  }

  static extractServiceName(text, patterns) {
    if (!patterns.serviceName) return null;
    
    for (const pattern of patterns.serviceName) {
      const matches = text.match(pattern);
      if (matches) {
        return matches[0]; // 返回完整匹配的服務名稱
      }
    }
    return null;
  }

  static calculateNextRenewalDate(day, emailDate = null) {
    // 如果有郵件接收日期，使用它作為基準
    const baseDate = emailDate ? new Date(emailDate) : new Date();
    const currentMonth = baseDate.getMonth();
    const currentYear = baseDate.getFullYear();
    
    let renewalDate = new Date(currentYear, currentMonth, day);
    
    // 如果是收據郵件，通常是扣款後發送，所以下次扣款應該是下個月
    if (emailDate) {
      renewalDate = new Date(currentYear, currentMonth + 1, day);
    } else {
      // 如果日期已過，設定為下個月
      if (renewalDate <= baseDate) {
        renewalDate = new Date(currentYear, currentMonth + 1, day);
      }
    }
    
    return renewalDate.toISOString().split('T')[0];
  }

  static detectCurrency(text, fromEmail = '') {
    // 檢查明確的貨幣標示
    if (text.includes('NT$') || text.includes('TWD')) return 'TWD';
    if (text.includes('USD')) return 'USD';
    
    // 針對特定服務的預設貨幣判斷
    const lowerText = text.toLowerCase() + ' ' + fromEmail.toLowerCase();
    
    // 國際服務通常使用 USD
    const internationalServices = ['anthropic', 'claude', 'openai', 'github', 'notion', 'figma', 'canva', 'dropbox', 'slack', 'zoom'];
    if (internationalServices.some(service => lowerText.includes(service))) {
      return 'USD';
    }
    
    // 如果包含 $ 但沒有明確標示，根據服務判斷
    if (text.includes('$')) {
      // 檢查是否為國際服務
      if (internationalServices.some(service => lowerText.includes(service))) {
        return 'USD';
      }
      return 'TWD'; // 其他情況預設台幣
    }
    
    return 'TWD'; // 預設台幣
  }

  static calculateConfidence(email, serviceConfig) {
    let confidence = 0;
    
    // 寄件者匹配
    if (serviceConfig.senders.some(sender => 
      email.from.toLowerCase().includes(sender.toLowerCase())
    )) {
      confidence += 40;
    }
    
    // 主旨匹配
    if (serviceConfig.subjects.some(subject => 
      email.subject.toLowerCase().includes(subject.toLowerCase())
    )) {
      confidence += 30;
    }
    
    // 找到金額
    const text = `${email.subject} ${email.body || ''}`;
    if (this.extractAmount(text, serviceConfig.patterns)) {
      confidence += 20;
    }
    
    // 找到續約日期
    if (this.extractRenewalDate(text, serviceConfig.patterns)) {
      confidence += 10;
    }
    
    return Math.min(confidence, 100);
  }

  static parseSubscriptionEmail(email) {
    const service = this.identifyService(email.from, email.subject, email.body);
    if (!service) return null;

    const config = subscriptionPatterns[service];
    const text = `${email.subject} ${email.body || ''}`;
    
    const amount = this.extractAmount(text, config.patterns) || this.getDefaultAmount(config, text, email.from);
    let renewalDate = this.extractRenewalDate(text, config.patterns);
    const plan = this.extractPlan(text, config.patterns);
    const currency = this.detectCurrency(text, email.from);
    const confidence = this.calculateConfidence(email, config);

    // 嘗試從郵件內容提取具體的服務名稱
    const extractedServiceName = this.extractServiceName(text, config.patterns);

    // 如果沒有從郵件內容找到續費日期，使用郵件接收日期推算
    if (!renewalDate && email.date) {
      // 對於收據郵件，假設是當月已扣款，下次扣款是下個月同一天
      const emailDate = new Date(email.date);
      const renewalDay = emailDate.getDate();
      renewalDate = this.calculateNextRenewalDate(renewalDay, email.date);
    }

    // 對於通用模式，降低準確度要求但仍需要基本資訊
    const minConfidence = service === 'generic' ? 30 : 50;
    if (!renewalDate && confidence < minConfidence) return null;

    // 優先使用從郵件內容提取的服務名稱，否則使用預設顯示名稱
    const serviceName = extractedServiceName || this.getServiceDisplayName(service, email.from, email.subject);

    return {
      name: serviceName,
      plan: plan || '預設方案',
      amount: amount,
      currency: currency,
      renewalDate: renewalDate || this.calculateNextRenewalDate(15), // 預設15號
      category: config.category,
      color: config.color,
      detectedFrom: 'gmail',
      confidence: confidence,
      originalEmail: {
        id: email.id,
        from: email.from,
        subject: email.subject,
        date: email.date,
        receivedDate: email.receivedDate,
        receivedTime: email.receivedTime
      }
    };
  }

  // 獲取預設金額（考慮貨幣）
  static getDefaultAmount(config, text, fromEmail = '') {
    const currency = this.detectCurrency(text, fromEmail);
    if (config.defaultAmount[currency]) {
      return config.defaultAmount[currency];
    }
    // 如果沒有對應貨幣，回傳第一個可用的
    return Object.values(config.defaultAmount)[0] || 0;
  }

  // 改善服務名稱顯示
  static getServiceDisplayName(service, from, subject) {
    if (service === 'generic') {
      // 從寄件者或主旨中提取可能的服務名稱
      const fromDomain = from.split('@')[1]?.replace(/\.com|\.net|\.org/gi, '');
      if (fromDomain && fromDomain !== 'gmail' && fromDomain !== 'yahoo' && fromDomain !== 'outlook') {
        return fromDomain.charAt(0).toUpperCase() + fromDomain.slice(1);
      }
      
      // 從主旨中查找品牌名稱
      const subjectWords = subject.split(/\s+/);
      for (const word of subjectWords) {
        if (word.length > 3 && /^[A-Za-z]/.test(word)) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
      }
      
      return '未知服務';
    }
    
    // 特定服務的顯示名稱
    const serviceDisplayNames = {
      'claude': 'Claude AI',
      'openai': 'OpenAI',
      'chatgpt': 'ChatGPT',
      'github': 'GitHub',
      'anthropic': 'Claude AI' // 向後兼容
    };
    
    return serviceDisplayNames[service] || service.charAt(0).toUpperCase() + service.slice(1);
  }
}