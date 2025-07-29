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

import { useTheme } from './hooks/useTheme';
import { useCurrency } from './hooks/useCurrency';
import { useSubscriptions } from './hooks/useSubscriptions';

const App = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { baseCurrency, exchangeRates, setBaseCurrency, updateExchangeRates } = useCurrency();
  const {
    subscriptions,
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

  const handleShowAddForm = () => {
    setEditingSubscription(null);
    setShowAddForm(true);
  };

  const handleEditSubscription = (subscription) => {
    setEditingSubscription(subscription);
    setShowAddForm(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingSubscription) {
      updateSubscription({ ...formData, id: editingSubscription.id });
    } else {
      addSubscription(formData);
    }
    setShowAddForm(false);
    setEditingSubscription(null);
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingSubscription(null);
  };

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
          />
        );
      case 'calendar':
        return (
          <CalendarView
            subscriptions={subscriptions}
            darkMode={darkMode}
          />
        );
      case 'list':
        return (
          <ListView
            sortedSubscriptions={sortedSubscriptions}
            baseCurrency={baseCurrency}
            exchangeRates={exchangeRates}
            darkMode={darkMode}
            onEdit={handleEditSubscription}
            onDelete={deleteSubscription}
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

export default App;