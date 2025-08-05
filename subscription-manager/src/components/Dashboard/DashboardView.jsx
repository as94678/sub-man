// src/components/Dashboard/DashboardView.jsx

import React from 'react';
import { DollarSign, List, Calendar, Globe } from 'lucide-react';
import StatCard from './StatCard';
import UpcomingRenewals from './UpcomingRenewals';
import { formatCurrency } from '../../utils/currency';

const DashboardView = ({ 
  totalMonthlySpending,
  subscriptionsCount,
  upcomingRenewals,
  baseCurrency,
  darkMode
}) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 統計卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          title="月總花費"
          value={formatCurrency(totalMonthlySpending, baseCurrency)}
          icon={DollarSign}
          color="pink"
          darkMode={darkMode}
        />
        
        <StatCard
          title="訂閱項目"
          value={subscriptionsCount}
          icon={List}
          color="blue"
          darkMode={darkMode}
        />
        
        <StatCard
          title="即將扣款"
          value={upcomingRenewals.length}
          icon={Calendar}
          color="orange"
          darkMode={darkMode}
        />
        
        <StatCard
          title="年總花費"
          value={formatCurrency(totalMonthlySpending * 12, baseCurrency)}
          icon={Globe}
          color="green"
          darkMode={darkMode}
        />
      </div>

      {/* 即將扣款提醒 */}
      <UpcomingRenewals 
        upcomingRenewals={upcomingRenewals}
        darkMode={darkMode}
      />
    </div>
  );
};

export default DashboardView;