// src/components/Charts/ChartsView.jsx

import React from 'react';
import CategoryPieChart from './CategoryPieChart';
import SpendingBarChart from './SpendingBarChart';

const ChartsView = ({ 
  categoryData, 
  sortedSubscriptions, 
  baseCurrency, 
  exchangeRates, 
  darkMode 
}) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CategoryPieChart
          categoryData={categoryData}
          baseCurrency={baseCurrency}
          darkMode={darkMode}
        />
        
        <SpendingBarChart
          sortedSubscriptions={sortedSubscriptions}
          baseCurrency={baseCurrency}
          exchangeRates={exchangeRates}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default ChartsView;