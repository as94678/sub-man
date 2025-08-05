// src/components/Common/FloatingAddButton.jsx

import React from 'react';
import { PlusCircle } from 'lucide-react';

const FloatingAddButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-pink-500 to-blue-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
    >
      <PlusCircle size={20} className="sm:w-6 sm:h-6" />
    </button>
  );
};

export default FloatingAddButton;