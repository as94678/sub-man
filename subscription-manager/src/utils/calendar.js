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
      
      // 找出當天的訂閱扣款（考慮循環續費）
      const daySubscriptions = subscriptions.filter(sub => {
        const originalDate = new Date(sub.renewalDate);
        const renewalDay = originalDate.getDate();
        
        // 檢查當天是否為該訂閱的續費日
        return currentDate.getDate() === renewalDay;
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
 * 計算下次續費日期
 * @param {string} renewalDate - 原始續費日期 (YYYY-MM-DD)
 * @returns {Date} 下次續費日期
 */
export const getNextRenewalDate = (renewalDate) => {
  const today = new Date();
  const originalDate = new Date(renewalDate);
  const renewalDay = originalDate.getDate();
  
  // 找到今天或之後的第一個續費日
  let nextRenewal = new Date(today.getFullYear(), today.getMonth(), renewalDay);
  
  // 如果本月的續費日已過，移到下個月
  if (nextRenewal <= today) {
    nextRenewal = new Date(today.getFullYear(), today.getMonth() + 1, renewalDay);
    
    // 處理月末日期問題（例如 1/31 -> 2/28）
    if (nextRenewal.getDate() !== renewalDay) {
      nextRenewal = new Date(today.getFullYear(), today.getMonth() + 2, 0); // 該月最後一天
    }
  }
  
  return nextRenewal;
};

/**
 * 獲取即將到期的訂閱（扣款前2天開始提醒）
 * @param {Array} subscriptions - 訂閱列表
 * @returns {Array} 即將到期的訂閱，按日期排序
 */
export const getUpcomingRenewals = (subscriptions) => {
  const today = new Date();
  const twoDaysFromNow = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
  
  return subscriptions.map(sub => {
    const nextRenewalDate = getNextRenewalDate(sub.renewalDate);
    const daysUntilRenewal = Math.ceil((nextRenewalDate - today) / (24 * 60 * 60 * 1000));
    
    return {
      ...sub,
      nextRenewalDate: nextRenewalDate.toISOString().split('T')[0],
      actualRenewalDate: nextRenewalDate,
      daysUntilRenewal
    };
  }).filter(sub => {
    // 顯示扣款前2天內的訂閱（包含當天）
    return sub.daysUntilRenewal >= 0 && sub.daysUntilRenewal <= 2;
  }).sort((a, b) => a.actualRenewalDate - b.actualRenewalDate);
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