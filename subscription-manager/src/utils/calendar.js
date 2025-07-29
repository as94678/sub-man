// src/utils/calendar.js

/**
 * 生成月曆數據
 * @param {Date} date - 目標月份的任意日期
 * @param {Array} subscriptions - 訂閱列表
 * @returns {Array} 日曆數據二維陣列
 */
export const generateCalendar = (date, subscriptions = []) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  
  // 從週日開始顯示
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const calendar = [];
  const currentDate = new Date(startDate);
  
  for (let week = 0; week < 6; week++) {
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // 找出當天的訂閱扣款
      const daySubscriptions = subscriptions.filter(sub => {
        const subDate = new Date(sub.renewalDate);
        return subDate.getDate() === currentDate.getDate() && 
               subDate.getMonth() === currentDate.getMonth() &&
               subDate.getFullYear() === currentDate.getFullYear();
      });
      
      weekDays.push({
        date: new Date(currentDate),
        dateStr,
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === new Date().toDateString(),
        subscriptions: daySubscriptions
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    calendar.push(weekDays);
  }
  
  return calendar;
};

/**
 * 獲取即將到期的訂閱（未來7天內）
 * @param {Array} subscriptions - 訂閱列表
 * @returns {Array} 即將到期的訂閱，按日期排序
 */
export const getUpcomingRenewals = (subscriptions) => {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return subscriptions.filter(sub => {
    const renewalDate = new Date(sub.renewalDate);
    return renewalDate >= today && renewalDate <= nextWeek;
  }).sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate));
};

/**
 * 獲取月份導航信息
 * @param {Date} currentMonth - 當前月份
 * @returns {Object} 包含前一月、下一月和當前月份信息
 */
export const getMonthNavigation = (currentMonth) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  return {
    previous: new Date(year, month - 1),
    next: new Date(year, month + 1),
    current: currentMonth,
    monthName: currentMonth.toLocaleDateString('zh-TW', { 
      year: 'numeric', 
      month: 'long' 
    })
  };
};