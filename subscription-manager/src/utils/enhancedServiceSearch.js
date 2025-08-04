// 增強服務搜索引擎 - 支持模糊搜索、大小寫不敏感、學習功能

import { ENHANCED_SUBSCRIPTION_SERVICES, userLearnedServices } from '../data/enhancedSubscriptionServices';

export class EnhancedServiceSearch {
  constructor() {
    this.services = ENHANCED_SUBSCRIPTION_SERVICES;
    this.userServices = userLearnedServices;
  }

  /**
   * 主要搜索方法 - 支持多種搜索策略
   */
  searchServices(query, options = {}) {
    const {
      limit = 20,
      includeUserLearned = true,
      caseSensitive = false,
      fuzzyThreshold = 0.6,
      boostUserServices = true
    } = options;

    if (!query || query.trim() === '') {
      return this.getDefaultSuggestions(limit, includeUserLearned);
    }

    const normalizedQuery = caseSensitive ? query : query.toLowerCase().trim();
    const allServices = includeUserLearned ? 
      [...this.services, ...this.userServices.learnedServices] : 
      this.services;

    // 多階段搜索結果
    const searchResults = [];

    // 1. 精確匹配（最高優先級）
    const exactMatches = this.findExactMatches(allServices, normalizedQuery, caseSensitive);
    searchResults.push(...exactMatches.map(service => ({
      ...service,
      matchType: 'exact',
      relevanceScore: 100
    })));

    // 2. 別名匹配
    const aliasMatches = this.findAliasMatches(allServices, normalizedQuery, caseSensitive);
    searchResults.push(...aliasMatches
      .filter(service => !searchResults.some(s => s.id === service.id))
      .map(service => ({
        ...service,
        matchType: 'alias',
        relevanceScore: 90
      }))
    );

    // 3. 開頭匹配
    const prefixMatches = this.findPrefixMatches(allServices, normalizedQuery, caseSensitive);
    searchResults.push(...prefixMatches
      .filter(service => !searchResults.some(s => s.id === service.id))
      .map(service => ({
        ...service,
        matchType: 'prefix',
        relevanceScore: 80
      }))
    );

    // 4. 包含匹配
    const containsMatches = this.findContainsMatches(allServices, normalizedQuery, caseSensitive);
    searchResults.push(...containsMatches
      .filter(service => !searchResults.some(s => s.id === service.id))
      .map(service => ({
        ...service,
        matchType: 'contains',
        relevanceScore: 70
      }))
    );

    // 5. 模糊匹配
    const fuzzyMatches = this.findFuzzyMatches(allServices, normalizedQuery, fuzzyThreshold);
    searchResults.push(...fuzzyMatches
      .filter(service => !searchResults.some(s => s.id === service.id))
      .map(service => ({
        ...service.service,
        matchType: 'fuzzy',
        relevanceScore: service.similarity * 60
      }))
    );

    // 6. 關鍵字匹配
    const keywordMatches = this.findKeywordMatches(allServices, normalizedQuery, caseSensitive);
    searchResults.push(...keywordMatches
      .filter(service => !searchResults.some(s => s.id === service.id))
      .map(service => ({
        ...service,
        matchType: 'keyword',
        relevanceScore: 50
      }))
    );

    // 計算최종 relevance score 並排序
    const scoredResults = searchResults.map(result => ({
      ...result,
      finalScore: this.calculateFinalScore(result, query, boostUserServices)
    }));

    // 按最終分數排序並返回
    return scoredResults
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, limit);
  }

  /**
   * 精確匹配
   */
  findExactMatches(services, query, caseSensitive) {
    return services.filter(service => {
      const serviceName = caseSensitive ? service.name : service.name.toLowerCase();
      return serviceName === query;
    });
  }

  /**
   * 別名匹配
   */
  findAliasMatches(services, query, caseSensitive) {
    return services.filter(service => {
      if (!service.aliases) return false;
      
      return service.aliases.some(alias => {
        const aliasName = caseSensitive ? alias : alias.toLowerCase();
        return aliasName === query || aliasName.includes(query);
      });
    });
  }

  /**
   * 開頭匹配
   */
  findPrefixMatches(services, query, caseSensitive) {
    return services.filter(service => {
      const serviceName = caseSensitive ? service.name : service.name.toLowerCase();
      return serviceName.startsWith(query);
    });
  }

  /**
   * 包含匹配
   */
  findContainsMatches(services, query, caseSensitive) {
    return services.filter(service => {
      const serviceName = caseSensitive ? service.name : service.name.toLowerCase();
      const description = caseSensitive ? service.description : service.description.toLowerCase();
      
      return serviceName.includes(query) || description.includes(query);
    });
  }

  /**
   * 模糊匹配 - 使用編輯距離算法
   */
  findFuzzyMatches(services, query, threshold) {
    const fuzzyResults = [];

    for (const service of services) {
      const serviceName = service.name.toLowerCase();
      const similarity = this.calculateSimilarity(query, serviceName);
      
      if (similarity >= threshold) {
        fuzzyResults.push({
          service,
          similarity
        });
      }

      // 也檢查別名
      if (service.aliases) {
        for (const alias of service.aliases) {
          const aliasSimilarity = this.calculateSimilarity(query, alias.toLowerCase());
          if (aliasSimilarity >= threshold) {
            fuzzyResults.push({
              service,
              similarity: aliasSimilarity
            });
            break; // 找到一個匹配的別名就足夠了
          }
        }
      }
    }

    return fuzzyResults.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * 關鍵字匹配
   */
  findKeywordMatches(services, query, caseSensitive) {
    const queryWords = query.split(' ').filter(word => word.length > 2);
    if (queryWords.length === 0) return [];

    return services.filter(service => {
      const keywords = service.keywords || [];
      const serviceText = `${service.name} ${service.description} ${keywords.join(' ')}`;
      const searchText = caseSensitive ? serviceText : serviceText.toLowerCase();

      return queryWords.some(word => searchText.includes(word));
    });
  }

  /**
   * 計算字符串相似度 - 使用 Levenshtein 距離
   */
  calculateSimilarity(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;

    // 創建矩陣
    const matrix = Array(len2 + 1).fill().map(() => Array(len1 + 1).fill(0));

    // 初始化矩陣
    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;

    // 填充矩陣
    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        if (str1[i - 1] === str2[j - 1]) {
          matrix[j][i] = matrix[j - 1][i - 1];
        } else {
          matrix[j][i] = Math.min(
            matrix[j - 1][i] + 1,     // 插入
            matrix[j][i - 1] + 1,     // 刪除
            matrix[j - 1][i - 1] + 1  // 替換
          );
        }
      }
    }

    // 計算相似度（0-1之間）
    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : (maxLen - matrix[len2][len1]) / maxLen;
  }

  /**
   * 計算最終分數
   */
  calculateFinalScore(result, originalQuery, boostUserServices) {
    let score = result.relevanceScore;

    // 用戶學習服務加分
    if (boostUserServices && result.isUserLearned) {
      score += 20;
      // 根據使用頻率進一步加分
      if (result.usageCount) {
        score += Math.min(result.usageCount * 2, 15);
      }
    }

    // 受歡迎程度加分
    if (result.popularity) {
      score += (result.popularity / 100) * 10;
    }

    // 最近使用加分
    if (result.lastUsed) {
      const daysSinceLastUse = (Date.now() - result.lastUsed) / (1000 * 60 * 60 * 24);
      if (daysSinceLastUse < 7) {
        score += 10 - daysSinceLastUse;
      }
    }

    // 查詢長度匹配加分
    const queryLen = originalQuery.length;
    const nameLen = result.name.length;
    const lengthDiff = Math.abs(queryLen - nameLen);
    if (lengthDiff <= 2) {
      score += 5;
    }

    return Math.round(score * 100) / 100;
  }

  /**
   * 獲取預設建議
   */
  getDefaultSuggestions(limit, includeUserLearned) {
    const suggestions = [];

    // 用戶學習的服務（按使用頻率排序）
    if (includeUserLearned) {
      const userSuggestions = this.userServices.getSuggestedServices(Math.min(5, limit));
      suggestions.push(...userSuggestions.map(service => ({
        ...service,
        matchType: 'user_suggestion',
        relevanceScore: 95,
        finalScore: 95 + (service.usageCount || 0)
      })));
    }

    // 熱門服務
    const popularServices = this.services
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit - suggestions.length)
      .map(service => ({
        ...service,
        matchType: 'popular',
        relevanceScore: 80,
        finalScore: 80 + (service.popularity / 100) * 15
      }));

    suggestions.push(...popularServices);

    return suggestions
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, limit);
  }

  /**
   * 學習用戶輸入
   */
  learnFromUserInput(serviceName, additionalInfo = {}) {
    const { category, price, currency } = additionalInfo;
    
    // 檢查是否為已知服務
    const existingService = this.searchServices(serviceName, { limit: 1, fuzzyThreshold: 0.9 })[0];
    
    if (!existingService || existingService.relevanceScore < 90) {
      // 這是一個新服務，需要學習
      this.userServices.learnService(serviceName, category, price, currency);
      console.log(`✅ 學習新服務: ${serviceName}`);
      return true;
    } else {
      // 更新現有服務的使用統計
      this.userServices.updateUsageStats(serviceName);
      console.log(`📊 更新服務使用統計: ${serviceName}`);
      return false;
    }
  }

  /**
   * 獲取搜索統計
   */
  getSearchStats() {
    return {
      totalServices: this.services.length,
      userLearnedServices: this.userServices.learnedServices.length,
      totalUsageRecords: Object.keys(this.userServices.usageStats).length,
      mostUsedServices: Object.entries(this.userServices.usageStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }))
    };
  }

  /**
   * 清除學習數據（用於調試）
   */
  clearUserData() {
    this.userServices.clearLearnedData();
  }
}

// 創建全域實例
export const enhancedServiceSearch = new EnhancedServiceSearch();

// 便捷函數
export const searchServices = (query, options) => enhancedServiceSearch.searchServices(query, options);
export const learnFromUserInput = (serviceName, additionalInfo) => enhancedServiceSearch.learnFromUserInput(serviceName, additionalInfo);
export const getDefaultPricing = (service) => {
  if (!service.pricing || service.pricing.length === 0) {
    return { price: 0, currency: 'USD', region: 'Unknown' };
  }

  // 優先台灣定價
  const twPricing = service.pricing.find(p => p.region === 'TW');
  if (twPricing) return twPricing;
  
  // 其次美國定價
  const usPricing = service.pricing.find(p => p.region === 'US');
  if (usPricing) return usPricing;
  
  // 回退到第一個定價
  return service.pricing[0];
};