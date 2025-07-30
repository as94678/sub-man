// 常見訂閱服務資料庫
export const SUBSCRIPTION_SERVICES = [
  // 串流娛樂
  {
    id: 'netflix',
    name: 'Netflix',
    icon: 'fab fa-netflix',
    category: '娛樂',
    color: '#E50914',
    pricing: [
      { region: 'US', price: 15.99, currency: 'USD' },
      { region: 'TW', price: 390, currency: 'TWD' }
    ],
    description: '影片串流服務'
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    icon: 'fas fa-crown',
    category: '娛樂',
    color: '#113CCF',
    pricing: [
      { region: 'US', price: 7.99, currency: 'USD' },
      { region: 'TW', price: 270, currency: 'TWD' }
    ],
    description: 'Disney 串流服務'
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium',
    icon: 'fab fa-youtube',
    category: '娛樂',
    color: '#FF0000',
    pricing: [
      { region: 'US', price: 11.99, currency: 'USD' },
      { region: 'TW', price: 179, currency: 'TWD' }
    ],
    description: 'YouTube 無廣告服務'
  },
  {
    id: 'amazon-prime',
    name: 'Amazon Prime',
    icon: 'fab fa-amazon',
    category: '娛樂',
    color: '#FF9900',
    pricing: [
      { region: 'US', price: 14.98, currency: 'USD' }
    ],
    description: '亞馬遜會員服務'
  },
  {
    id: 'apple-tv',
    name: 'Apple TV+',
    icon: 'fab fa-apple',
    category: '娛樂',
    color: '#000000',
    pricing: [
      { region: 'US', price: 6.99, currency: 'USD' },
      { region: 'TW', price: 170, currency: 'TWD' }
    ],
    description: 'Apple 串流服務'
  },

  // 音樂服務
  {
    id: 'spotify',
    name: 'Spotify Premium',
    icon: 'fab fa-spotify',
    category: '音樂',
    color: '#1DB954',
    pricing: [
      { region: 'US', price: 9.99, currency: 'USD' },
      { region: 'TW', price: 149, currency: 'TWD' }
    ],
    description: '音樂串流服務'
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    icon: 'fab fa-apple',
    category: '音樂',
    color: '#FA243C',
    pricing: [
      { region: 'US', price: 10.99, currency: 'USD' },
      { region: 'TW', price: 150, currency: 'TWD' }
    ],
    description: 'Apple 音樂服務'
  },
  {
    id: 'youtube-music',
    name: 'YouTube Music',
    icon: 'fab fa-youtube',
    category: '音樂',
    color: '#FF0000',
    pricing: [
      { region: 'US', price: 9.99, currency: 'USD' },
      { region: 'TW', price: 149, currency: 'TWD' }
    ],
    description: 'YouTube 音樂服務'
  },

  // 生產力工具
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    icon: 'fas fa-robot',
    category: '工具',
    color: '#10A37F',
    pricing: [
      { region: 'US', price: 20.00, currency: 'USD' }
    ],
    description: 'AI 對話助手'
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    icon: 'fab fa-github',
    category: '工具',
    color: '#24292e',
    pricing: [
      { region: 'US', price: 10.00, currency: 'USD' }
    ],
    description: 'AI 程式碼助手'
  },
  {
    id: 'notion',
    name: 'Notion Pro',
    icon: 'fas fa-sticky-note',
    category: '工具',
    color: '#000000',
    pricing: [
      { region: 'US', price: 8.00, currency: 'USD' }
    ],
    description: '筆記和專案管理'
  },
  {
    id: 'figma',
    name: 'Figma Professional',
    icon: 'fas fa-palette',
    category: '工具',
    color: '#F24E1E',
    pricing: [
      { region: 'US', price: 12.00, currency: 'USD' }
    ],
    description: '設計協作工具'
  },
  {
    id: 'adobe-creative',
    name: 'Adobe Creative Cloud',
    icon: 'fab fa-adobe',
    category: '工具',
    color: '#DA1F26',
    pricing: [
      { region: 'US', price: 52.99, currency: 'USD' }
    ],
    description: 'Adobe 創意套件'
  },
  {
    id: 'canva-pro',
    name: 'Canva Pro',
    icon: 'fas fa-image',
    category: '工具',
    color: '#00C4CC',
    pricing: [
      { region: 'US', price: 12.99, currency: 'USD' }
    ],
    description: '線上設計工具'
  },

  // 雲端儲存
  {
    id: 'google-one',
    name: 'Google One',
    icon: 'fab fa-google',
    category: '工具',
    color: '#4285F4',
    pricing: [
      { region: 'US', price: 1.99, currency: 'USD' },
      { region: 'TW', price: 65, currency: 'TWD' }
    ],
    description: 'Google 雲端儲存'
  },
  {
    id: 'icloud',
    name: 'iCloud+',
    icon: 'fas fa-cloud',
    category: '工具',
    color: '#007AFF',
    pricing: [
      { region: 'US', price: 0.99, currency: 'USD' },
      { region: 'TW', price: 30, currency: 'TWD' }
    ],
    description: 'Apple 雲端服務'
  },
  {
    id: 'dropbox',
    name: 'Dropbox Plus',
    icon: 'fab fa-dropbox',
    category: '工具',
    color: '#0061FF',
    pricing: [
      { region: 'US', price: 9.99, currency: 'USD' }
    ],
    description: '雲端檔案同步'
  },

  // 學習平台
  {
    id: 'duolingo',
    name: 'Duolingo Plus',
    icon: 'fas fa-language',
    category: '學習',
    color: '#58CC02',
    pricing: [
      { region: 'US', price: 6.99, currency: 'USD' }
    ],
    description: '語言學習應用'
  },
  {
    id: 'coursera',
    name: 'Coursera Plus',
    icon: 'fas fa-graduation-cap',
    category: '學習',
    color: '#0056D3',
    pricing: [
      { region: 'US', price: 59.00, currency: 'USD' }
    ],
    description: '線上課程平台'
  },
  {
    id: 'udemy',
    name: 'Udemy Pro',
    icon: 'fas fa-book',
    category: '學習',
    color: '#A435F0',
    pricing: [
      { region: 'US', price: 29.99, currency: 'USD' }
    ],
    description: '線上學習平台'
  },

  // 健身
  {
    id: 'nike-training',
    name: 'Nike Training Club',
    icon: 'fab fa-nike',
    category: '健身',
    color: '#000000',
    pricing: [
      { region: 'US', price: 14.99, currency: 'USD' }
    ],
    description: '健身訓練應用'
  },
  {
    id: 'peloton',
    name: 'Peloton Digital',
    icon: 'fas fa-dumbbell',
    category: '健身',
    color: '#000000',
    pricing: [
      { region: 'US', price: 12.99, currency: 'USD' }
    ],
    description: '健身課程平台'
  },

  // 新聞媒體
  {
    id: 'nyt',
    name: 'New York Times',
    icon: 'fas fa-newspaper',
    category: '學習',
    color: '#000000',
    pricing: [
      { region: 'US', price: 17.00, currency: 'USD' }
    ],
    description: '新聞訂閱'
  },
  {
    id: 'medium',
    name: 'Medium Membership',
    icon: 'fab fa-medium',
    category: '學習',
    color: '#000000',
    pricing: [
      { region: 'US', price: 5.00, currency: 'USD' }
    ],
    description: '寫作平台會員'
  },

  // 遊戲
  {
    id: 'xbox-gamepass',
    name: 'Xbox Game Pass',
    icon: 'fab fa-xbox',
    category: '娛樂',
    color: '#107C10',
    pricing: [
      { region: 'US', price: 14.99, currency: 'USD' }
    ],
    description: '遊戲訂閱服務'
  },
  {
    id: 'playstation-plus',
    name: 'PlayStation Plus',
    icon: 'fab fa-playstation',
    category: '娛樂',
    color: '#003791',
    pricing: [
      { region: 'US', price: 9.99, currency: 'USD' }
    ],
    description: 'PlayStation 訂閱'
  },

  // VPN 服務
  {
    id: 'nordvpn',
    name: 'NordVPN',
    icon: 'fas fa-shield-alt',
    category: '工具',
    color: '#4687FF',
    pricing: [
      { region: 'US', price: 11.95, currency: 'USD' }
    ],
    description: 'VPN 安全服務'
  },
  {
    id: 'expressvpn',
    name: 'ExpressVPN',
    icon: 'fas fa-lock',
    category: '工具',
    color: '#DA3940',
    pricing: [
      { region: 'US', price: 12.95, currency: 'USD' }
    ],
    description: 'VPN 服務'
  }
];

// 搜尋服務的函數
export const searchServices = (query) => {
  if (!query) return SUBSCRIPTION_SERVICES.slice(0, 10); // 預設顯示前10個
  
  const searchTerm = query.toLowerCase();
  return SUBSCRIPTION_SERVICES.filter(service => 
    service.name.toLowerCase().includes(searchTerm) ||
    service.description.toLowerCase().includes(searchTerm) ||
    service.category.toLowerCase().includes(searchTerm)
  );
};

// 根據 ID 取得服務資訊
export const getServiceById = (id) => {
  return SUBSCRIPTION_SERVICES.find(service => service.id === id);
};

// 根據類別取得服務
export const getServicesByCategory = (category) => {
  return SUBSCRIPTION_SERVICES.filter(service => service.category === category);
};

// 取得預設定價 (優先台灣，其次美國)
export const getDefaultPricing = (service) => {
  const twPricing = service.pricing.find(p => p.region === 'TW');
  if (twPricing) return twPricing;
  
  const usPricing = service.pricing.find(p => p.region === 'US');
  if (usPricing) return usPricing;
  
  return service.pricing[0]; // 回退到第一個定價
};