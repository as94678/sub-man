// src/components/SubscriptionList/ListView.jsx

import React from 'react';
import SubscriptionTable from './SubscriptionTable';

const ListView = ({ 
  sortedSubscriptions, 
  baseCurrency, 
  exchangeRates, 
  darkMode,
  onEdit,
  onDelete,
  onShowAddForm
}) => {
  return (
    <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">📋 訂閱清單</h3>
        <button
          onClick={onShowAddForm}
          className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
        >
          新增訂閱
        </button>
      </div>
      
      <SubscriptionTable
        subscriptions={sortedSubscriptions}
        baseCurrency={baseCurrency}
        exchangeRates={exchangeRates}
        darkMode={darkMode}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default ListView;