// API 服務層 - 純前端模式，使用 localStorage 模擬後端

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

// 模擬延遲的異步操作
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模擬用戶數據庫
const getUsersDB = () => {
  const users = localStorage.getItem('users_db');
  return users ? JSON.parse(users) : [];
};

const saveUsersDB = (users) => {
  localStorage.setItem('users_db', JSON.stringify(users));
};

// 生成簡單的用戶ID
const generateUserId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// 生成簡單的認證token
const generateAuthToken = (userId) => {
  return btoa(JSON.stringify({ userId, timestamp: Date.now() }));
};

// 解析token獲取用戶ID
const parseAuthToken = (token) => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};

// 認證相關 API
export const authAPI = {
  // 註冊
  register: async (userData) => {
    await delay(500); // 模擬網路延遲
    
    const users = getUsersDB();
    
    // 檢查email是否已存在
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('此email已經註冊過了');
    }
    
    // 創建新用戶
    const userId = generateUserId();
    const newUser = {
      id: userId,
      name: userData.name,
      email: userData.email,
      password: userData.password, // 實際應用中應該要加密
      createdAt: new Date().toISOString(),
      avatar: null
    };
    
    users.push(newUser);
    saveUsersDB(users);
    
    // 生成token並保存
    const token = generateAuthToken(userId);
    setAuthToken(token);
    
    // 返回用戶資訊（不包含密碼）
    const { password, ...userWithoutPassword } = newUser;
    return {
      success: true,
      user: userWithoutPassword,
      token
    };
  },

  // 登入
  login: async (credentials) => {
    await delay(500); // 模擬網路延遲
    
    const users = getUsersDB();
    
    // 查找用戶
    const user = users.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('電子郵件或密碼錯誤');
    }
    
    // 生成token並保存
    const token = generateAuthToken(user.id);
    setAuthToken(token);
    
    // 返回用戶資訊（不包含密碼）
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      user: userWithoutPassword,
      token
    };
  },

  // Google 登入
  googleLogin: async (googleUser) => {
    await delay(500); // 模擬網路延遲
    
    const users = getUsersDB();
    
    // 檢查是否已有此Google用戶
    let user = users.find(u => u.email === googleUser.email);
    
    if (!user) {
      // 創建新的Google用戶
      const userId = generateUserId();
      user = {
        id: userId,
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
        googleId: googleUser.sub,
        createdAt: new Date().toISOString(),
        loginMethod: 'google'
      };
      
      users.push(user);
      saveUsersDB(users);
    } else {
      // 更新現有用戶的Google信息
      user.avatar = googleUser.picture;
      user.googleId = googleUser.sub;
      user.lastLoginAt = new Date().toISOString();
      saveUsersDB(users);
    }
    
    // 生成token並保存
    const token = generateAuthToken(user.id);
    setAuthToken(token);
    
    return {
      success: true,
      user,
      token
    };
  },

  // 登出
  logout: () => {
    clearAuthToken();
    return { success: true };
  },

  // 獲取當前用戶資訊
  getCurrentUser: async () => {
    await delay(200); // 模擬網路延遲
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('未登入');
    }
    
    const tokenData = parseAuthToken(token);
    if (!tokenData) {
      throw new Error('無效的認證token');
    }
    
    const users = getUsersDB();
    const user = users.find(u => u.id === tokenData.userId);
    
    if (!user) {
      throw new Error('用戶不存在');
    }
    
    // 返回用戶資訊（不包含密碼）
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      user: userWithoutPassword
    };
  },

  // 檢查是否已登入
  isAuthenticated: () => {
    const token = getAuthToken();
    if (!token) return false;
    
    const tokenData = parseAuthToken(token);
    if (!tokenData) return false;
    
    // 檢查token是否過期（7天）
    const tokenAge = Date.now() - tokenData.timestamp;
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7天
    
    if (tokenAge > maxAge) {
      clearAuthToken();
      return false;
    }
    
    return true;
  },

  // 更新用戶資料
  updateProfile: async (updates) => {
    await delay(500);
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('未登入');
    }
    
    const tokenData = parseAuthToken(token);
    const users = getUsersDB();
    const userIndex = users.findIndex(u => u.id === tokenData.userId);
    
    if (userIndex === -1) {
      throw new Error('用戶不存在');
    }
    
    // 更新用戶資料
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    saveUsersDB(users);
    
    // 返回更新後的用戶資訊（不包含密碼）
    const { password, ...userWithoutPassword } = users[userIndex];
    return {
      success: true,
      user: userWithoutPassword
    };
  }
};

// 用戶管理相關 API
export const userAPI = {
  // 獲取用戶資料
  getProfile: async () => {
    await delay(200);
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('未登入');
    }
    
    const tokenData = parseAuthToken(token);
    const users = getUsersDB();
    const user = users.find(u => u.id === tokenData.userId);
    
    if (!user) {
      throw new Error('用戶不存在');
    }
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // 獲取用戶統計
  getStats: async () => {
    await delay(200);
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('未登入');
    }
    
    const tokenData = parseAuthToken(token);
    const users = getUsersDB();
    const user = users.find(u => u.id === tokenData.userId);
    
    if (!user) {
      throw new Error('用戶不存在');
    }
    
    // 模擬統計資料
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    const totalMonthlySpent = subscriptions.reduce((total, sub) => total + parseFloat(sub.price || 0), 0);
    
    return {
      subscriptionCount: subscriptions.length,
      totalMonthlySpent: totalMonthlySpent.toFixed(2),
      accountCreated: user.createdAt,
      memberSince: user.createdAt
    };
  },

  // 更新用戶資料
  updateProfile: async (updates) => {
    await delay(500);
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('未登入');
    }
    
    const tokenData = parseAuthToken(token);
    const users = getUsersDB();
    const userIndex = users.findIndex(u => u.id === tokenData.userId);
    
    if (userIndex === -1) {
      throw new Error('用戶不存在');
    }
    
    // 更新用戶資料
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    saveUsersDB(users);
    
    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  },

  // 修改密碼
  changePassword: async ({ currentPassword, newPassword }) => {
    await delay(500);
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('未登入');
    }
    
    const tokenData = parseAuthToken(token);
    const users = getUsersDB();
    const userIndex = users.findIndex(u => u.id === tokenData.userId);
    
    if (userIndex === -1) {
      throw new Error('用戶不存在');
    }
    
    // 驗證當前密碼
    if (users[userIndex].password !== currentPassword) {
      throw new Error('目前密碼錯誤');
    }
    
    // 更新密碼
    users[userIndex].password = newPassword;
    users[userIndex].updatedAt = new Date().toISOString();
    
    saveUsersDB(users);
    
    return { success: true };
  },

  // 刪除帳戶
  deleteAccount: async (password) => {
    await delay(500);
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('未登入');
    }
    
    const tokenData = parseAuthToken(token);
    const users = getUsersDB();
    const userIndex = users.findIndex(u => u.id === tokenData.userId);
    
    if (userIndex === -1) {
      throw new Error('用戶不存在');
    }
    
    // 驗證密碼
    if (users[userIndex].password !== password) {
      throw new Error('密碼錯誤');
    }
    
    // 刪除用戶
    users.splice(userIndex, 1);
    saveUsersDB(users);
    
    // 清除認證
    clearAuthToken();
    
    return { success: true };
  }
};

// 訂閱相關 API（模擬後端，使用 localStorage）
export const subscriptionAPI = {
  // 獲取所有訂閱
  getAll: async () => {
    await delay(200);
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    return subscriptions;
  },

  // 創建訂閱
  create: async (subscriptionData) => {
    await delay(300);
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    const newSubscription = {
      ...subscriptionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    subscriptions.push(newSubscription);
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    return newSubscription;
  },

  // 更新訂閱
  update: async (id, updates) => {
    await delay(300);
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    const index = subscriptions.findIndex(sub => sub.id === id);
    
    if (index === -1) {
      throw new Error('訂閱不存在');
    }
    
    subscriptions[index] = {
      ...subscriptions[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    return subscriptions[index];
  },

  // 刪除訂閱
  delete: async (id) => {
    await delay(200);
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    const filteredSubscriptions = subscriptions.filter(sub => sub.id !== id);
    
    if (filteredSubscriptions.length === subscriptions.length) {
      throw new Error('訂閱不存在');
    }
    
    localStorage.setItem('subscriptions', JSON.stringify(filteredSubscriptions));
    return { success: true };
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