// src/App.jsx

import React, { useState } from 'react';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import CurrencyConverter from './components/Forms/CurrencyConverter';
import DashboardView from './components/Dashboard/DashboardView';
import ChartsView from './components/Charts/ChartsView';
import CalendarView from './components/Calendar/CalendarView';
import ListView from './components/SubscriptionList/ListView';
import SubscriptionForm from './components/Forms/SubscriptionForm';
import FloatingAddButton from './components/Common/FloatingAddButton';
import Modal from './components/Common/Modal';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';

import { useTheme } from './hooks/useTheme';
import { useCurrency } from './hooks/useCurrency';
import { useSubscriptions } from './hooks/useSubscriptions';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';

// 主應用組件（需要被 AuthProvider 包裹）
const MainApp = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { baseCurrency, exchangeRates, isLoading, lastUpdated, setBaseCurrency, updateExchangeRates } = useCurrency();
  const {
    subscriptions,
    loading: subscriptionsLoading,
    error: subscriptionsError,
    totalMonthlySpending,
    categoryData,
    sortedSubscriptions,
    upcomingRenewals,
    addSubscription,
    updateSubscription,
    deleteSubscription
  } = useSubscriptions(baseCurrency, exchangeRates);

  const [activeView, setActiveView] = useState('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [showCurrencyConverter, setShowCurrencyConverter] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' 或 'register'

  // 認證相關處理
  const handleShowLogin = () => setAuthMode('login');
  const handleShowRegister = () => setAuthMode('register');

  const handleShowAddForm = () => {
    setEditingSubscription(null);
    setShowAddForm(true);
  };

  const handleEditSubscription = (subscription) => {
    setEditingSubscription(subscription);
    setShowAddForm(true);
  };

  const handleFormSubmit = async (formData) => {
    let result;
    if (editingSubscription) {
      result = await updateSubscription({ ...formData, id: editingSubscription.id });
    } else {
      result = await addSubscription(formData);
    }
    
    if (result.success) {
      setShowAddForm(false);
      setEditingSubscription(null);
    } else {
      // 錯誤處理可以在這裡添加
      console.error('操作失敗:', result.error);
    }
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingSubscription(null);
  };

  const handleDelete = async (id) => {
    const result = await deleteSubscription(id);
    if (!result.success) {
      console.error('刪除失敗:', result.error);
    }
  };

  // 如果用戶未登入，顯示登入/註冊頁面
  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <LoginForm onSwitchToRegister={handleShowRegister} />
    ) : (
      <RegisterForm onSwitchToLogin={handleShowLogin} />
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            totalMonthlySpending={totalMonthlySpending}
            subscriptionsCount={subscriptions.length}
            upcomingRenewals={upcomingRenewals}
            baseCurrency={baseCurrency}
            darkMode={darkMode}
            loading={subscriptionsLoading}
          />
        );
      case 'charts':
        return (
          <ChartsView
            categoryData={categoryData}
            sortedSubscriptions={sortedSubscriptions}
            baseCurrency={baseCurrency}
            exchangeRates={exchangeRates}
            darkMode={darkMode}
            loading={subscriptionsLoading}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            subscriptions={subscriptions}
            darkMode={darkMode}
            loading={subscriptionsLoading}
          />
        );
      case 'list':
        return (
          <ListView
            sortedSubscriptions={sortedSubscriptions}
            baseCurrency={baseCurrency}
            exchangeRates={exchangeRates}
            darkMode={darkMode}
            loading={subscriptionsLoading}
            onEdit={handleEditSubscription}
            onDelete={handleDelete}
            onShowAddForm={handleShowAddForm}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-pink-50 to-blue-50 text-gray-800'
    }`}>
      <Header
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        baseCurrency={baseCurrency}
        setBaseCurrency={setBaseCurrency}
        updateExchangeRates={updateExchangeRates}
        showCurrencyConverter={showCurrencyConverter}
        setShowCurrencyConverter={setShowCurrencyConverter}
        user={user}
        onLogout={logout}
      />

      <CurrencyConverter
        exchangeRates={exchangeRates}
        darkMode={darkMode}
        isVisible={showCurrencyConverter}
      />

      <Navigation
        activeView={activeView}
        setActiveView={setActiveView}
        darkMode={darkMode}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {subscriptionsError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
            錯誤: {subscriptionsError}
          </div>
        )}
        {renderActiveView()}
      </div>

      {/* 浮動新增按鈕 - 只在dashboard顯示 */}
      {activeView === 'dashboard' && (
        <FloatingAddButton onClick={handleShowAddForm} />
      )}

      {/* 新增/編輯表單模態框 */}
      <Modal isOpen={showAddForm} onClose={handleFormCancel} darkMode={darkMode}>
        <SubscriptionForm
          subscription={editingSubscription}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          darkMode={darkMode}
          baseCurrency={baseCurrency}
          exchangeRates={exchangeRates}
        />
      </Modal>
    </div>
  );
};

// 應用程式根組件
const App = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;