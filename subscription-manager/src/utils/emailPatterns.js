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
  }
};

// 通用解析工具
export class EmailParser {
  static identifyService(sender, subject, body = '') {
    const text = `${sender} ${subject} ${body}`.toLowerCase();
    
    for (const [serviceKey, config] of Object.entries(subscriptionPatterns)) {
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

  static calculateNextRenewalDate(day) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let renewalDate = new Date(currentYear, currentMonth, day);
    
    // 如果日期已過，設定為下個月
    if (renewalDate <= now) {
      renewalDate = new Date(currentYear, currentMonth + 1, day);
    }
    
    return renewalDate.toISOString().split('T')[0];
  }

  static detectCurrency(text) {
    if (text.includes('NT$') || text.includes('TWD')) return 'TWD';
    if (text.includes('USD') || text.includes('$')) return 'USD';
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
    
    const amount = this.extractAmount(text, config.patterns) || config.defaultAmount.TWD;
    const renewalDate = this.extractRenewalDate(text, config.patterns);
    const plan = this.extractPlan(text, config.patterns);
    const currency = this.detectCurrency(text);
    const confidence = this.calculateConfidence(email, config);

    if (!renewalDate && confidence < 50) return null;

    return {
      name: service.charAt(0).toUpperCase() + service.slice(1),
      plan: plan || '標準方案',
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
        date: email.date
      }
    };
  }
}