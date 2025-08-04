// 增強版服務選擇器 - 支援智能搜索、用戶學習、大小寫不敏感

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X, Star, TrendingUp, Users, Sparkles, Info } from 'lucide-react';
import { searchServices, learnFromUserInput, getDefaultPricing } from '../../utils/enhancedServiceSearch';

const EnhancedServiceSelector = ({ 
  value, 
  onChange, 
  onServiceSelect, 
  darkMode, 
  placeholder = "搜尋或輸入服務名稱..." 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [filteredServices, setFilteredServices] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchStats, setSearchStats] = useState(null);
  const [showLearningHint, setShowLearningHint] = useState(false);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // 搜尋服務
  useEffect(() => {
    const services = searchServices(searchTerm, {
      limit: 15,
      includeUserLearned: true,
      caseSensitive: false,
      fuzzyThreshold: 0.6,
      boostUserServices: true
    });
    
    setFilteredServices(services);
    setHighlightedIndex(-1);

    // 檢查是否顯示學習提示
    if (searchTerm.length > 2 && services.length === 0) {
      setShowLearningHint(true);
    } else {
      setShowLearningHint(false);
    }
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
    
    // 學習用戶選擇
    if (service.isUserLearned) {
      learnFromUserInput(service.name);
    }
    
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

  // 處理手動輸入（用戶按 Enter 或失去焦點時）
  const handleManualInput = () => {
    if (searchTerm && searchTerm.length > 1) {
      // 檢查是否為新服務
      const existingService = filteredServices.find(s => 
        s.name.toLowerCase() === searchTerm.toLowerCase()
      );
      
      if (!existingService) {
        // 這是新服務，記錄學習
        console.log(`🎓 用戶輸入新服務: ${searchTerm}`);
        // 注意：這裡我們不立即學習，而是在用戶提交表單時學習
        // 這樣可以獲得更完整的信息（類別、價格等）
      }
    }
  };

  // 鍵盤導航
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
        return;
      }
      return;
    }

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
        if (highlightedIndex >= 0 && filteredServices[highlightedIndex]) {
          handleServiceSelect(filteredServices[highlightedIndex]);
        } else {
          handleManualInput();
          setIsOpen(false);
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
        handleManualInput();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchTerm]);

  // 清除輸入
  const handleClear = () => {
    setSearchTerm('');
    setIsOpen(false);
    onChange('');
    inputRef.current?.focus();
  };

  // 獲取匹配類型圖標
  const getMatchTypeIcon = (matchType) => {
    switch (matchType) {
      case 'exact':
      case 'alias':
        return <Star className="w-3 h-3 text-yellow-500" />;
      case 'user_suggestion':
        return <Users className="w-3 h-3 text-blue-500" />;
      case 'popular':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'fuzzy':
        return <Sparkles className="w-3 h-3 text-purple-500" />;
      default:
        return null;
    }
  };

  // 獲取匹配類型說明
  const getMatchTypeLabel = (matchType) => {
    switch (matchType) {
      case 'exact':
        return '精確匹配';
      case 'alias':
        return '別名匹配';
      case 'user_suggestion':
        return '您常用的';
      case 'popular':
        return '熱門服務';
      case 'fuzzy':
        return '相似匹配';
      case 'prefix':
        return '開頭匹配';
      case 'contains':
        return '包含匹配';
      case 'keyword':
        return '關鍵字匹配';
      default:
        return '';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 輸入框 */}
      <div className="relative">
        <div className={`flex items-center border rounded-md transition-all ${
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
                className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
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
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-1 max-h-80 overflow-y-auto rounded-md shadow-lg z-50 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {/* 搜索結果 */}
          {filteredServices.length > 0 ? (
            <>
              {filteredServices.map((service, index) => {
                const defaultPricing = getDefaultPricing(service);
                const isHighlighted = index === highlightedIndex;
                
                return (
                  <div
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className={`flex items-center px-4 py-3 cursor-pointer transition-colors border-l-2 ${
                      isHighlighted
                        ? darkMode 
                          ? 'bg-gray-700 border-blue-500' 
                          : 'bg-blue-50 border-blue-500'
                        : darkMode
                          ? 'hover:bg-gray-700 border-transparent'
                          : 'hover:bg-gray-50 border-transparent'
                    }`}
                  >
                    {/* 服務圖標 */}
                    <div 
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-3 relative"
                      style={{ backgroundColor: `${service.color}20`, color: service.color }}
                    >
                      <i className={service.icon}></i>
                      {/* 用戶學習標記 */}
                      {service.isUserLearned && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Users className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>

                    {/* 服務資訊 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`font-medium truncate ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {service.name}
                        </div>
                        {/* 匹配類型圖標 */}
                        {getMatchTypeIcon(service.matchType)}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`text-sm truncate ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {service.description}
                        </div>
                        
                        {/* 匹配類型標籤 */}
                        {service.matchType && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                            service.matchType === 'user_suggestion'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                              : service.matchType === 'exact' || service.matchType === 'alias'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {getMatchTypeLabel(service.matchType)}
                          </span>
                        )}
                      </div>

                      {/* 使用統計（僅用戶學習的服務） */}
                      {service.isUserLearned && service.usageCount && (
                        <div className={`text-xs mt-1 ${
                          darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          已使用 {service.usageCount} 次
                        </div>
                      )}
                    </div>

                    {/* 價格和類別 */}
                    <div className="flex-shrink-0 text-right ml-3">
                      <div className={`text-sm font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {defaultPricing.price > 0 ? 
                          `${defaultPricing.currency} ${defaultPricing.price}` : 
                          '價格待定'
                        }
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
            </>
          ) : (
            /* 無搜索結果 */
            <div className="px-4 py-6 text-center">
              {showLearningHint ? (
                /* 學習提示 */
                <div className={`space-y-3 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">找不到 "{searchTerm}"</span>
                  </div>
                  <div className="text-sm">
                    沒關係！直接輸入並繼續填寫表單，
                    <br />
                    系統會學習這個新服務 🎓
                  </div>
                  <div className={`text-xs px-3 py-2 rounded-lg ${
                    darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-700'
                  }`}>
                    💡 提示：下次搜索時就會出現在建議中
                  </div>
                </div>
              ) : (
                /* 一般無結果 */
                <div className={`${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <div>找不到相關服務</div>
                  <div className="text-xs mt-1">嘗試使用不同的關鍵字</div>
                </div>
              )}
            </div>
          )}

          {/* 底部統計信息（當有結果時顯示） */}
          {filteredServices.length > 0 && (
            <div className={`px-4 py-2 border-t text-xs flex items-center justify-between ${
              darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'
            }`}>
              <span>找到 {filteredServices.length} 個服務</span>
              <div className="flex items-center gap-1">
                <Info className="w-3 h-3" />
                <span>支援模糊搜索</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedServiceSelector;