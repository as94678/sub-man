// src/data/initialData.js

export const INITIAL_SUBSCRIPTIONS = [
  {
    id: 1,
    name: 'Netflix',
    price: 15.99,
    currency: 'USD',
    renewalDate: '2025-08-15',
    category: '娛樂',
    color: '#E50914'
  },
  {
    id: 2,
    name: 'YouTube Premium',
    price: 11.99,
    currency: 'USD',
    renewalDate: '2025-08-05',
    category: '娛樂',
    color: '#FF0000'
  },
  {
    id: 3,
    name: 'ChatGPT Plus',
    price: 20,
    currency: 'USD',
    renewalDate: '2025-08-20',
    category: '工具',
    color: '#10A37F'
  },
  {
    id: 4,
    name: 'Spotify Premium',
    price: 149,
    currency: 'TWD',
    renewalDate: '2025-08-10',
    category: '音樂',
    color: '#1DB954'
  }
];

export const CATEGORIES = ['娛樂', '工具', '音樂', '健身', '學習', '工作', '其他'];

export const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#E50914', // Netflix Red
  '#FF0000', // YouTube Red
  '#10A37F', // ChatGPT Green
  '#1DB954'  // Spotify Green
];