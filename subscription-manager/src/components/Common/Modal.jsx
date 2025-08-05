// src/components/Common/Modal.jsx

import React from 'react';

const Modal = ({ isOpen, onClose, children, darkMode }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl shadow-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;