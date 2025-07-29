// src/components/Common/FloatingAddButton.jsx

import React from 'react';
import { PlusCircle } from 'lucide-react';

const FloatingAddButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-blue-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
    >
      <PlusCircle size={24} />
    </button>
  );
};

export default FloatingAddButton;