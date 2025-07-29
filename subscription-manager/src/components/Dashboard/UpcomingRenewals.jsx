// src/components/Dashboard/UpcomingRenewals.jsx

import React from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { addToGoogleCalendar, addAllToGoogleCalendar } from '../../utils/googleCalendar';

const UpcomingRenewals = ({ upcomingRenewals, darkMode }) => {
  if (upcomingRenewals.length === 0) return null;

  return (
    <div className={`p-6 rounded-2xl shadow-lg ${
      darkMode ? 'bg-gray-800 border-orange-500' : 'bg-orange-50 border-orange-200'
    } border-2`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-orange-600">🔔 即將扣款提醒</h3>
        <button
          onClick={() => addAllToGoogleCalendar(upcomingRenewals)}
          className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          <Calendar size={16} />
          <span>全部加入日曆</span>
        </button>
      </div>
      <div className="space-y-2">
        {upcomingRenewals.map(sub => (
          <div key={sub.id} className="flex justify-between items-center">
            <div>
              <span className="font-medium">{sub.name}</span>
              <span className="ml-2 text-sm text-gray-500">
                {formatCurrency(sub.price, sub.currency)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{sub.renewalDate}</span>
              <button
                onClick={() => addToGoogleCalendar(sub)}
                className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                title="加入Google日曆"
              >
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingRenewals;