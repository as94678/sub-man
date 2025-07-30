// 服務選擇器組件 - 支援搜尋和自動完成

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { searchServices, getDefaultPricing } from '../../data/subscriptionServices';

const ServiceSelector = ({ 
  value, 
  onChange, 
  onServiceSelect, 
  darkMode, 
  placeholder = "搜尋或選擇服務..." 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [filteredServices, setFilteredServices] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // 搜尋服務
  useEffect(() => {
    const services = searchServices(searchTerm);
    setFilteredServices(services);
    setHighlightedIndex(-1);
  }, [searchTerm]);

  // 處理輸入變更
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    onChange(newValue);
  };

  // 選擇服務
  const handleServiceSelect = (service) => {
    setSearchTerm(service.name);
    setIsOpen(false);
    onChange(service.name);
    
    // 自動填入其他欄位
    if (onServiceSelect) {
      const defaultPricing = getDefaultPricing(service);
      onServiceSelect({
        name: service.name,
        price: defaultPricing.price,
        currency: defaultPricing.currency,
        category: service.category,
        color: service.color
      });
    }
  };

  // 鍵盤導航
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredServices.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleServiceSelect(filteredServices[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // 點擊外部關閉
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 清除輸入
  const handleClear = () => {
    setSearchTerm('');
    setIsOpen(false);
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 輸入框 */}
      <div className="relative">
        <div className={`flex items-center border rounded-md ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        } ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}>
          <Search className={`ml-3 h-4 w-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`flex-1 px-3 py-2 bg-transparent outline-none ${
              darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
            }`}
          />
          <div className="flex items-center pr-2">
            {searchTerm && (
              <button
                onClick={handleClear}
                className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${
              isOpen ? 'rotate-180' : ''
            } ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        </div>
      </div>

      {/* 下拉選單 */}
      {isOpen && filteredServices.length > 0 && (
        <div className={`absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto rounded-md shadow-lg z-50 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {filteredServices.map((service, index) => {
            const defaultPricing = getDefaultPricing(service);
            return (
              <div
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                  index === highlightedIndex
                    ? darkMode 
                      ? 'bg-gray-700' 
                      : 'bg-blue-50'
                    : darkMode
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-50'
                }`}
              >
                {/* 服務 Icon */}
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-lg mr-3"
                  style={{ backgroundColor: `${service.color}20`, color: service.color }}
                >
                  <i className={service.icon}></i>
                </div>

                {/* 服務資訊 */}
                <div className="flex-1 min-w-0">
                  <div className={`font-medium truncate ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {service.name}
                  </div>
                  <div className={`text-sm truncate ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {service.description}
                  </div>
                </div>

                {/* 價格和類別 */}
                <div className="flex-shrink-0 text-right ml-3">
                  <div className={`text-sm font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {defaultPricing.currency} {defaultPricing.price}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {service.category}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* 如果搜尋無結果 */}
          {searchTerm && filteredServices.length === 0 && (
            <div className={`px-4 py-3 text-center ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              找不到符合的服務
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceSelector;