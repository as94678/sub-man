// API 服務層 - 處理所有後端 API 請求

const API_BASE_URL = 'http://localhost:3001/api';

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

// 基礎 fetch 包裝器
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '請求失敗');
    }

    return data;
  } catch (error) {
    console.error('API請求錯誤:', error);
    throw error;
  }
};

// 認證相關 API
export const authAPI = {
  // 註冊
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // 登入
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // Google 登入
  googleLogin: async (idToken) => {
    const response = await apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // 登出
  logout: () => {
    clearAuthToken();
  },

  // 獲取當前用戶資訊
  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },

  // 檢查是否已登入
  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

// 訂閱相關 API
export const subscriptionsAPI = {
  // 獲取所有訂閱
  getAll: async () => {
    const response = await apiRequest('/subscriptions');
    return response.subscriptions || [];
  },

  // 新增訂閱
  create: async (subscriptionData) => {
    const response = await apiRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });
    return response.subscription;
  },

  // 更新訂閱
  update: async (id, subscriptionData) => {
    const response = await apiRequest(`/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subscriptionData),
    });
    return response.subscription;
  },

  // 刪除訂閱
  delete: async (id) => {
    return await apiRequest(`/subscriptions/${id}`, {
      method: 'DELETE',
    });
  },
};

// 用戶管理相關 API
export const userAPI = {
  // 取得用戶完整資料
  getProfile: async () => {
    const response = await apiRequest('/user/profile');
    return response.user;
  },

  // 更新用戶基本資料
  updateProfile: async (profileData) => {
    const response = await apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response;
  },

  // 修改密碼
  changePassword: async (passwordData) => {
    return await apiRequest('/user/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  // 更新用戶設定
  updateSettings: async (settings) => {
    const response = await apiRequest('/user/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return response;
  },

  // 取得帳戶統計
  getStats: async () => {
    const response = await apiRequest('/user/stats');
    return response.stats;
  },

  // 刪除帳戶
  deleteAccount: async (password) => {
    return await apiRequest('/user/account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  },
};

// 導出工具函數
export { getAuthToken, setAuthToken, clearAuthToken };