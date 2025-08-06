// API 服務層 - 連接真實後端

// API 基礎 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sub-man.onrender.com';

// 獲取儲存的 token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// 設定 token
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// 清除 token
const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};

// HTTP 請求封裝
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };
  
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  return response.json();
};

// 認證相關 API
export const authAPI = {
  // 註冊
  register: async (userData) => {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: userData
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // 登入
  login: async (credentials) => {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: credentials
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // Google 登入
  googleLogin: async (googleUser) => {
    const response = await apiRequest('/api/auth/google', {
      method: 'POST',
      body: { googleToken: googleUser }
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // 登出
  logout: () => {
    clearAuthToken();
    return { success: true };
  },

  // 獲取當前用戶資訊
  getCurrentUser: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('未登入');
    }
    
    return await apiRequest('/api/auth/me');
  },

  // 檢查是否已登入
  isAuthenticated: () => {
    const token = getAuthToken();
    return !!token;
  },

  // 更新用戶資料
  updateProfile: async (updates) => {
    return await apiRequest('/api/user/profile', {
      method: 'PUT',
      body: updates
    });
  }
};

// 用戶管理相關 API
export const userAPI = {
  // 獲取用戶資料
  getProfile: async () => {
    return await apiRequest('/api/user/profile');
  },

  // 獲取用戶統計
  getStats: async () => {
    return await apiRequest('/api/user/stats');
  },

  // 更新用戶資料
  updateProfile: async (updates) => {
    return await apiRequest('/api/user/profile', {
      method: 'PUT',
      body: updates
    });
  },

  // 修改密碼
  changePassword: async (passwordData) => {
    return await apiRequest('/api/user/password', {
      method: 'PUT',
      body: passwordData
    });
  },

  // 刪除帳戶
  deleteAccount: async (password) => {
    await apiRequest('/api/user/account', {
      method: 'DELETE',
      body: { password }
    });
    
    clearAuthToken();
    return { success: true };
  }
};

// 訂閱相關 API
export const subscriptionAPI = {
  // 獲取所有訂閱
  getAll: async () => {
    return await apiRequest('/api/subscriptions');
  },

  // 創建訂閱
  create: async (subscriptionData) => {
    return await apiRequest('/api/subscriptions', {
      method: 'POST',
      body: subscriptionData
    });
  },

  // 更新訂閱
  update: async (id, updates) => {
    return await apiRequest(`/api/subscriptions/${id}`, {
      method: 'PUT',
      body: updates
    });
  },

  // 刪除訂閱
  delete: async (id) => {
    return await apiRequest(`/api/subscriptions/${id}`, {
      method: 'DELETE'
    });
  },

  // 兼容舊方法名稱
  getSubscriptions: async () => {
    return await subscriptionAPI.getAll();
  },

  createSubscription: async (subscriptionData) => {
    return await subscriptionAPI.create(subscriptionData);
  },

  updateSubscription: async (id, updates) => {
    return await subscriptionAPI.update(id, updates);
  },

  deleteSubscription: async (id) => {
    return await subscriptionAPI.delete(id);
  }
};