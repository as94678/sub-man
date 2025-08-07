// 會員資料管理頁面

import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Settings, Lock, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { userAPI } from '../../services/api';

const ProfileView = ({ darkMode }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 個人資料表單
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: ''
  });

  // 密碼修改表單
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 刪除帳戶表單
  const [deleteForm, setDeleteForm] = useState({
    password: '',
    confirm: false
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const profile = await userAPI.getProfile();
      
      setProfileForm({
        name: profile.user?.name || profile.name || '',
        email: profile.user?.email || profile.email || ''
      });
    } catch (err) {
      setError('載入資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await userAPI.updateProfile(profileForm);
      setSuccess('個人資料更新成功');
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('新密碼確認不相符');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('新密碼至少需要6個字符');
      return;
    }

    try {
      await userAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setSuccess('密碼修改成功');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError('');

    if (!deleteForm.confirm) {
      setError('請確認您要刪除帳戶');
      return;
    }

    try {
      await userAPI.deleteAccount(deleteForm.password);
      alert('帳戶已刪除，將自動登出');
      logout();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'profile', label: '個人資料', icon: User },
    { id: 'password', label: '修改密碼', icon: Lock },
    { id: 'delete', label: '刪除帳戶', icon: Trash2 }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">會員管理</h1>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          管理您的帳戶資訊和設定
        </p>
      </div>

      {/* 錯誤和成功訊息 */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {/* 標籤頁導航 */}
      <div className="flex space-x-1 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 標籤頁內容 */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">個人資料</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">姓名</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">電子郵件</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                更新資料
              </button>
            </form>
          </div>
        )}


        {activeTab === 'password' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">修改密碼</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">目前密碼</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">新密碼</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">確認新密碼</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                修改密碼
              </button>
            </form>
          </div>
        )}

        {activeTab === 'delete' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-red-600">刪除帳戶</h2>
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">
                ⚠️ 警告：此操作無法復原！刪除帳戶將永久移除您的所有資料，包括訂閱記錄。
              </p>
            </div>
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">請輸入密碼確認</label>
                <input
                  type="password"
                  value={deleteForm.password}
                  onChange={(e) => setDeleteForm({...deleteForm, password: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="confirm-delete"
                  checked={deleteForm.confirm}
                  onChange={(e) => setDeleteForm({...deleteForm, confirm: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="confirm-delete" className="text-sm">
                  我了解此操作無法復原，確定要刪除帳戶
                </label>
              </div>
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                disabled={!deleteForm.confirm}
              >
                永久刪除帳戶
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;