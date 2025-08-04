// 增強版訂閱服務資料庫 - 支援別名、學習功能和更全面的服務列表

export const ENHANCED_SUBSCRIPTION_SERVICES = [
  // === AI 服務 ===
  {
    id: 'claude-ai',
    name: 'Claude AI',
    aliases: ['claude', 'claude pro', 'anthropic claude', 'anthropic'],
    icon: 'fas fa-brain',
    category: 'AI',
    color: '#D97706',
    pricing: [
      { region: 'US', price: 20.00, currency: 'USD' },
      { region: 'Global', price: 20.00, currency: 'USD' }
    ],
    description: 'Anthropic AI 助理服務',
    keywords: ['ai', 'artificial intelligence', 'chatbot', 'assistant', 'anthropic'],
    popularity: 85
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    aliases: ['chatgpt', 'chat gpt', 'openai', 'gpt plus', 'gpt-4'],
    icon: 'fas fa-robot',
    category: 'AI',
    color: '#10A37F',
    pricing: [
      { region: 'US', price: 20.00, currency: 'USD' },
      { region: 'Global', price: 20.00, currency: 'USD' }
    ],
    description: 'OpenAI GPT AI 助理',
    keywords: ['ai', 'gpt', 'openai', 'chatbot', 'assistant'],
    popularity: 95
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    aliases: ['github copilot', 'copilot', 'github ai', 'code assistant'],
    icon: 'fab fa-github',
    category: 'AI',
    color: '#24292e',
    pricing: [
      { region: 'US', price: 10.00, currency: 'USD' }
    ],
    description: 'AI 程式碼助手',
    keywords: ['ai', 'programming', 'code', 'github', 'development'],
    popularity: 80
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    aliases: ['midjourney', 'mid journey', 'ai art', 'image generation'],
    icon: 'fas fa-image',
    category: 'AI',
    color: '#7C3AED',
    pricing: [
      { region: 'US', price: 10.00, currency: 'USD' }
    ],
    description: 'AI 圖像生成服務',
    keywords: ['ai', 'art', 'image', 'generation', 'creative'],
    popularity: 75
  },

  // === 串流娛樂 ===
  {
    id: 'netflix',
    name: 'Netflix',
    aliases: ['netflix', 'netflix premium', 'netflix標準', 'netflix基本'],
    icon: 'fab fa-netflix',
    category: '娛樂',
    color: '#E50914',
    pricing: [
      { region: 'US', price: 15.49, currency: 'USD' },
      { region: 'TW', price: 390, currency: 'TWD' }
    ],
    description: '全球最大影音串流平台',
    keywords: ['streaming', 'movies', 'tv shows', 'entertainment', 'video'],
    popularity: 100
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    aliases: ['disney plus', 'disney+', 'disney', 'disney streaming'],
    icon: 'fas fa-crown',
    category: '娛樂',
    color: '#113CCF',
    pricing: [
      { region: 'US', price: 7.99, currency: 'USD' },
      { region: 'TW', price: 270, currency: 'TWD' }
    ],
    description: 'Disney 官方串流服務',
    keywords: ['disney', 'streaming', 'movies', 'family', 'entertainment'],
    popularity: 85
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium',
    aliases: ['youtube premium', 'youtube', 'yt premium', 'youtube red'],
    icon: 'fab fa-youtube',
    category: '娛樂',
    color: '#FF0000',
    pricing: [
      { region: 'US', price: 11.99, currency: 'USD' },
      { region: 'TW', price: 179, currency: 'TWD' }
    ],
    description: 'YouTube 無廣告服務',
    keywords: ['youtube', 'video', 'streaming', 'no ads', 'premium'],
    popularity: 90
  },
  {
    id: 'amazon-prime',
    name: 'Amazon Prime',
    aliases: ['amazon prime', 'prime', 'amazon video', 'prime video'],
    icon: 'fab fa-amazon',
    category: '娛樂',
    color: '#FF9900',
    pricing: [
      { region: 'US', price: 14.98, currency: 'USD' }
    ],
    description: '亞馬遜Prime會員',
    keywords: ['amazon', 'prime', 'video', 'streaming', 'shopping'],
    popularity: 88
  },
  {
    id: 'hbo-max',
    name: 'HBO Max',
    aliases: ['hbo max', 'hbo', 'max', 'warner bros'],
    icon: 'fas fa-play-circle',
    category: '娛樂',
    color: '#B026FF',
    pricing: [
      { region: 'US', price: 15.99, currency: 'USD' }
    ],
    description: 'HBO 串流服務',
    keywords: ['hbo', 'streaming', 'movies', 'series', 'premium'],
    popularity: 70
  },

  // === 音樂服務 ===
  {
    id: 'spotify',
    name: 'Spotify Premium',
    aliases: ['spotify', 'spotify premium', 'spotify個人版', 'spotify family'],
    icon: 'fab fa-spotify',
    category: '音樂',
    color: '#1DB954',
    pricing: [
      { region: 'US', price: 9.99, currency: 'USD' },
      { region: 'TW', price: 149, currency: 'TWD' }
    ],
    description: '全球音樂串流服務',
    keywords: ['music', 'streaming', 'songs', 'playlists', 'podcasts'],
    popularity: 95
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    aliases: ['apple music', 'apple音樂', 'itunes music'],
    icon: 'fab fa-apple',
    category: '音樂',
    color: '#FA243C',
    pricing: [
      { region: 'US', price: 10.99, currency: 'USD' },
      { region: 'TW', price: 150, currency: 'TWD' }
    ],
    description: 'Apple 音樂串流服務',
    keywords: ['apple', 'music', 'streaming', 'songs', 'itunes'],
    popularity: 80
  },

  // === 生產力與工具 ===
  {
    id: 'notion',
    name: 'Notion Pro',
    aliases: ['notion', 'notion pro', 'notion personal', 'notion team'],
    icon: 'fas fa-sticky-note',
    category: '工具',
    color: '#000000',
    pricing: [
      { region: 'US', price: 8.00, currency: 'USD' }
    ],
    description: '全能筆記與專案管理工具',
    keywords: ['productivity', 'notes', 'project management', 'workspace'],
    popularity: 85
  },
  {
    id: 'figma',
    name: 'Figma Professional',
    aliases: ['figma', 'figma pro', 'figma professional', 'figma team'],
    icon: 'fas fa-palette',
    category: '工具',
    color: '#F24E1E',
    pricing: [
      { region: 'US', price: 12.00, currency: 'USD' }
    ],
    description: '協作設計與原型工具',
    keywords: ['design', 'ui', 'ux', 'prototyping', 'collaboration'],
    popularity: 82
  },
  {
    id: 'adobe-creative',
    name: 'Adobe Creative Cloud',
    aliases: ['adobe', 'adobe cc', 'creative cloud', 'photoshop', 'illustrator'],
    icon: 'fab fa-adobe',
    category: '工具',
    color: '#DA1F26',
    pricing: [
      { region: 'US', price: 52.99, currency: 'USD' },
      { region: 'TW', price: 1680, currency: 'TWD' }
    ],
    description: 'Adobe 創意設計套件',
    keywords: ['adobe', 'design', 'creative', 'photoshop', 'video editing'],
    popularity: 78
  },
  {
    id: 'canva-pro',
    name: 'Canva Pro',
    aliases: ['canva', 'canva pro', 'canva premium'],
    icon: 'fas fa-image',
    category: '工具',
    color: '#00C4CC',
    pricing: [
      { region: 'US', price: 12.99, currency: 'USD' },
      { region: 'TW', price: 390, currency: 'TWD' }
    ],
    description: '簡易設計工具',
    keywords: ['design', 'templates', 'graphics', 'social media'],
    popularity: 75
  },

  // === 外送與會員服務 ===
  {
    id: 'uber-one',
    name: 'Uber One',
    aliases: ['uber one', 'uber會員', 'uber eats會員', 'uber plus'],
    icon: 'fas fa-car',
    category: '生活',
    color: '#000000',
    pricing: [
      { region: 'US', price: 9.99, currency: 'USD' },
      { region: 'TW', price: 109, currency: 'TWD' }
    ],
    description: 'Uber 會員服務',
    keywords: ['uber', 'delivery', 'ride', 'membership', 'food'],
    popularity: 70
  },
  {
    id: 'foodpanda-pro',
    name: 'foodpanda Pro',
    aliases: ['foodpanda', 'foodpanda pro', 'foodpanda會員', 'panda pro'],
    icon: 'fas fa-utensils',
    category: '生活',
    color: '#E21B70',
    pricing: [
      { region: 'TW', price: 79, currency: 'TWD' },
      { region: 'SG', price: 2.99, currency: 'SGD' }
    ],
    description: 'foodpanda 會員服務',
    keywords: ['foodpanda', 'food delivery', 'membership', 'discount'],
    popularity: 65
  },
  {
    id: 'deliveroo-plus',
    name: 'Deliveroo Plus',
    aliases: ['deliveroo', 'deliveroo plus', 'deliveroo會員'],
    icon: 'fas fa-motorcycle',
    category: '生活',
    color: '#00CCBC',
    pricing: [
      { region: 'UK', price: 3.49, currency: 'GBP' },
      { region: 'SG', price: 4.99, currency: 'SGD' }
    ],
    description: 'Deliveroo 會員服務',
    keywords: ['deliveroo', 'food delivery', 'membership'],
    popularity: 60
  },

  // === 雲端儲存 ===
  {
    id: 'google-one',
    name: 'Google One',
    aliases: ['google one', 'google storage', 'google drive storage', 'google雲端'],
    icon: 'fab fa-google',
    category: '工具',
    color: '#4285F4',
    pricing: [
      { region: 'US', price: 1.99, currency: 'USD' },
      { region: 'TW', price: 65, currency: 'TWD' }
    ],
    description: 'Google 雲端儲存服務',
    keywords: ['google', 'cloud', 'storage', 'backup', 'drive'],
    popularity: 85
  },
  {
    id: 'icloud',
    name: 'iCloud+',
    aliases: ['icloud', 'icloud+', 'icloud plus', 'apple storage', 'apple雲端'],
    icon: 'fas fa-cloud',
    category: '工具',
    color: '#007AFF',
    pricing: [
      { region: 'US', price: 0.99, currency: 'USD' },
      { region: 'TW', price: 30, currency: 'TWD' }
    ],
    description: 'Apple 雲端儲存服務',
    keywords: ['apple', 'icloud', 'storage', 'backup', 'sync'],
    popularity: 80
  },
  {
    id: 'dropbox',
    name: 'Dropbox Plus',
    aliases: ['dropbox', 'dropbox plus', 'dropbox pro'],
    icon: 'fab fa-dropbox',
    category: '工具',
    color: '#0061FF',
    pricing: [
      { region: 'US', price: 9.99, currency: 'USD' }
    ],
    description: '雲端檔案同步服務',
    keywords: ['dropbox', 'cloud', 'storage', 'sync', 'files'],
    popularity: 70
  },

  // === 遊戲服務 ===
  {
    id: 'xbox-gamepass',
    name: 'Xbox Game Pass',
    aliases: ['xbox gamepass', 'game pass', 'xbox會員', 'microsoft gamepass'],
    icon: 'fab fa-xbox',
    category: '娛樂',
    color: '#107C10',
    pricing: [
      { region: 'US', price: 14.99, currency: 'USD' },
      { region: 'TW', price: 399, currency: 'TWD' }
    ],
    description: 'Xbox 遊戲訂閱服務',
    keywords: ['xbox', 'gaming', 'games', 'subscription', 'microsoft'],
    popularity: 75
  },
  {
    id: 'playstation-plus',
    name: 'PlayStation Plus',
    aliases: ['playstation plus', 'ps plus', 'ps+', 'sony plus'],
    icon: 'fab fa-playstation',
    category: '娛樂',
    color: '#003791',
    pricing: [
      { region: 'US', price: 9.99, currency: 'USD' },
      { region: 'TW', price: 270, currency: 'TWD' }
    ],
    description: 'PlayStation 會員服務',
    keywords: ['playstation', 'gaming', 'ps4', 'ps5', 'sony'],
    popularity: 78
  },
  {
    id: 'nintendo-switch-online',
    name: 'Nintendo Switch Online',
    aliases: ['nintendo switch online', 'switch online', 'nintendo會員'],
    icon: 'fas fa-gamepad',
    category: '娛樂',
    color: '#E60012',
    pricing: [
      { region: 'US', price: 3.99, currency: 'USD' },
      { region: 'TW', price: 100, currency: 'TWD' }
    ],
    description: 'Nintendo Switch 線上服務',
    keywords: ['nintendo', 'switch', 'gaming', 'online'],
    popularity: 72
  },

  // === VPN 與安全服務 ===
  {
    id: 'nordvpn',
    name: 'NordVPN',
    aliases: ['nordvpn', 'nord vpn', 'nord'],
    icon: 'fas fa-shield-alt',
    category: '工具',
    color: '#4687FF',
    pricing: [
      { region: 'US', price: 11.95, currency: 'USD' }
    ],
    description: 'VPN 安全服務',
    keywords: ['vpn', 'security', 'privacy', 'nord'],
    popularity: 80
  },
  {
    id: 'expressvpn',
    name: 'ExpressVPN',
    aliases: ['expressvpn', 'express vpn'],
    icon: 'fas fa-lock',
    category: '工具',
    color: '#DA3940',
    pricing: [
      { region: 'US', price: 12.95, currency: 'USD' }
    ],
    description: '高速VPN服務',
    keywords: ['vpn', 'security', 'privacy', 'express'],
    popularity: 78
  },

  // === 學習平台 ===
  {
    id: 'duolingo',
    name: 'Duolingo Plus',
    aliases: ['duolingo', 'duolingo plus', 'duolingo super'],
    icon: 'fas fa-language',
    category: '學習',
    color: '#58CC02',
    pricing: [
      { region: 'US', price: 6.99, currency: 'USD' }
    ],
    description: '語言學習應用',
    keywords: ['language', 'learning', 'education', 'duolingo'],
    popularity: 75
  },
  {
    id: 'coursera',
    name: 'Coursera Plus',
    aliases: ['coursera', 'coursera plus'],
    icon: 'fas fa-graduation-cap',
    category: '學習',
    color: '#0056D3',
    pricing: [
      { region: 'US', price: 59.00, currency: 'USD' }
    ],
    description: '線上課程平台',
    keywords: ['education', 'courses', 'learning', 'university'],
    popularity: 70
  },

  // === 新聞媒體 ===
  {
    id: 'nyt',
    name: 'New York Times',
    aliases: ['new york times', 'nyt', 'ny times', 'nytimes'],
    icon: 'fas fa-newspaper',
    category: '學習',
    color: '#000000',
    pricing: [
      { region: 'US', price: 17.00, currency: 'USD' }
    ],
    description: '紐約時報數位訂閱',
    keywords: ['news', 'newspaper', 'journalism', 'nyt'],
    popularity: 65
  },
  {
    id: 'medium',
    name: 'Medium Membership',
    aliases: ['medium', 'medium membership'],
    icon: 'fab fa-medium',
    category: '學習',
    color: '#000000',
    pricing: [
      { region: 'US', price: 5.00, currency: 'USD' }
    ],
    description: '寫作與閱讀平台',
    keywords: ['writing', 'reading', 'articles', 'blog'],
    popularity: 60
  },

  // === 健身服務 ===
  {
    id: 'peloton',
    name: 'Peloton Digital',
    aliases: ['peloton', 'peloton digital', 'peloton app'],
    icon: 'fas fa-dumbbell',
    category: '健身',
    color: '#000000',
    pricing: [
      { region: 'US', price: 12.99, currency: 'USD' }
    ],
    description: '健身課程平台',
    keywords: ['fitness', 'workout', 'exercise', 'cycling'],
    popularity: 65
  },
  {
    id: 'nike-training',
    name: 'Nike Training Club',
    aliases: ['nike training', 'nike training club', 'ntc'],
    icon: 'fab fa-nike',
    category: '健身',
    color: '#000000',
    pricing: [
      { region: 'US', price: 14.99, currency: 'USD' }
    ],
    description: 'Nike 健身訓練應用',
    keywords: ['nike', 'fitness', 'training', 'workout'],
    popularity: 68
  }
];

// 用戶學習的服務資料庫
export class UserLearnedServices {
  constructor() {
    this.learnedServices = this.loadLearnedServices();
    this.usageStats = this.loadUsageStats();
  }

  // 載入用戶學習的服務
  loadLearnedServices() {
    try {
      const stored = localStorage.getItem('user_learned_services');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load learned services:', error);
      return [];
    }
  }

  // 載入使用統計
  loadUsageStats() {
    try {
      const stored = localStorage.getItem('service_usage_stats');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to load usage stats:', error);
      return {};
    }
  }

  // 學習新服務
  learnService(serviceName, category = '其他', price = null, currency = 'USD') {
    const normalizedName = this.normalizeServiceName(serviceName);
    const serviceId = this.generateServiceId(normalizedName);

    // 檢查是否已存在
    const existing = this.learnedServices.find(s => 
      s.id === serviceId || 
      s.name.toLowerCase() === normalizedName.toLowerCase()
    );

    if (existing) {
      // 更新使用次數
      existing.usageCount = (existing.usageCount || 0) + 1;
      existing.lastUsed = Date.now();
      if (price && !existing.pricing.some(p => p.price === price && p.currency === currency)) {
        existing.pricing.push({ price, currency, region: 'User' });
      }
    } else {
      // 創建新的學習服務
      const newService = {
        id: serviceId,
        name: normalizedName,
        aliases: [serviceName.toLowerCase(), normalizedName.toLowerCase()],
        icon: 'fas fa-star', // 用戶學習的服務使用星星圖標
        category: category,
        color: this.generateColorForService(normalizedName),
        pricing: price ? [{ price, currency, region: 'User' }] : [],
        description: `用戶添加的 ${category} 服務`,
        keywords: this.generateKeywords(normalizedName, category),
        popularity: 1,
        isUserLearned: true,
        usageCount: 1,
        createdAt: Date.now(),
        lastUsed: Date.now()
      };

      this.learnedServices.push(newService);
    }

    this.saveLearnedServices();
    this.updateUsageStats(serviceName);
  }

  // 更新使用統計
  updateUsageStats(serviceName) {
    const normalizedName = this.normalizeServiceName(serviceName);
    this.usageStats[normalizedName] = (this.usageStats[normalizedName] || 0) + 1;
    this.saveUsageStats();
  }

  // 獲取所有服務（包括學習的）
  getAllServices() {
    return [...ENHANCED_SUBSCRIPTION_SERVICES, ...this.learnedServices];
  }

  // 獲取建議服務（基於使用頻率）
  getSuggestedServices(limit = 5) {
    return this.learnedServices
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, limit);
  }

  // 正規化服務名稱
  normalizeServiceName(name) {
    return name
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // 生成服務ID
  generateServiceId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  // 為服務生成顏色
  generateColorForService(name) {
    const colors = [
      '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
      '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
      '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
      '#EC4899', '#F43F5E'
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }

  // 生成關鍵字
  generateKeywords(name, category) {
    const words = name.toLowerCase().split(' ');
    const categoryKeywords = {
      '娛樂': ['entertainment', 'streaming', 'video', 'fun'],
      '音樂': ['music', 'audio', 'songs', 'streaming'],
      '工具': ['productivity', 'tool', 'software', 'app'],
      'AI': ['ai', 'artificial intelligence', 'assistant', 'bot'],
      '生活': ['lifestyle', 'daily', 'service', 'convenience'],
      '學習': ['education', 'learning', 'course', 'study'],
      '健身': ['fitness', 'health', 'workout', 'exercise']
    };

    return [...words, ...(categoryKeywords[category] || [])];
  }

  // 保存學習的服務
  saveLearnedServices() {
    try {
      localStorage.setItem('user_learned_services', JSON.stringify(this.learnedServices));
    } catch (error) {
      console.warn('Failed to save learned services:', error);
    }
  }

  // 保存使用統計
  saveUsageStats() {
    try {
      localStorage.setItem('service_usage_stats', JSON.stringify(this.usageStats));
    } catch (error) {
      console.warn('Failed to save usage stats:', error);
    }
  }

  // 清除學習數據（供調試使用）
  clearLearnedData() {
    this.learnedServices = [];
    this.usageStats = {};
    localStorage.removeItem('user_learned_services');
    localStorage.removeItem('service_usage_stats');
  }
}

// 創建全域實例
export const userLearnedServices = new UserLearnedServices();