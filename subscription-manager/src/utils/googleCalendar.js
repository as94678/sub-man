// src/utils/googleCalendar.js

import { formatCurrency } from './currency';
import { getNextRenewalDate } from './calendar';

/**
 * 將訂閱加入Google日曆
 * @param {Object} subscription - 訂閱對象
 */
export const addToGoogleCalendar = (subscription) => {
  const startDate = getNextRenewalDate(subscription.renewalDate);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1小時後結束
  
  const eventTitle = `${subscription.name} 訂閱扣款`;
  const eventDetails = `${subscription.name} 訂閱費用: ${formatCurrency(subscription.price, subscription.currency)}`;
  
  // 格式化日期為Google Calendar需要的格式
  const formatDateForGoogle = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(eventTitle)}` +
    `&dates=${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}` +
    `&details=${encodeURIComponent(eventDetails)}` +
    `&recur=RRULE:FREQ=MONTHLY;INTERVAL=1`;
  
  window.open(googleCalendarUrl, '_blank');
};

/**
 * 批量將所有訂閱加入Google日曆
 * @param {Array} subscriptions - 訂閱列表
 * @param {number} delay - 每個事件間的延遲時間（毫秒）
 */
export const addAllToGoogleCalendar = (subscriptions, delay = 500) => {
  subscriptions.forEach((subscription, index) => {
    setTimeout(() => {
      addToGoogleCalendar(subscription);
    }, index * delay);
  });
};