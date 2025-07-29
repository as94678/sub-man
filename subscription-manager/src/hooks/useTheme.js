// src/hooks/useTheme.js

import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // 從 localStorage 讀取主題偏好，預設為 false
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    // 保存主題偏好到 localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // 更新 document 的 class
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return {
    darkMode,
    toggleTheme
  };
};