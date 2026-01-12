/**
 * Hybrid Search Service
 * Combines keyword-based search with semantic similarity for improved results
 * 
 * Architecture:
 * - 50% weight: Keyword/text matching (SQL LIKE, full-text)
 * - 50% weight: Semantic similarity (concept matching via synonym expansion + category inference)
 */

// Comprehensive synonym map for semantic understanding
const synonymMap = {
  // Electronics
  'phone': ['mobile', 'smartphone', 'cellphone', 'iphone', 'android', 'handset', 'device'],
  'laptop': ['notebook', 'computer', 'pc', 'macbook', 'ultrabook', 'chromebook'],
  'tablet': ['ipad', 'pad', 'slate', 'e-reader'],
  'headphones': ['earphones', 'earbuds', 'headset', 'airpods', 'audio', 'earpiece'],
  'camera': ['dslr', 'mirrorless', 'webcam', 'cam', 'photography'],
  'tv': ['television', 'monitor', 'display', 'screen', 'smart tv'],
  'speaker': ['bluetooth speaker', 'soundbar', 'audio', 'portable speaker'],
  'watch': ['smartwatch', 'timepiece', 'wristwatch', 'apple watch', 'fitness tracker'],
  'charger': ['adapter', 'power bank', 'cable', 'usb', 'wireless charger'],
  'gaming': ['console', 'playstation', 'xbox', 'nintendo', 'controller', 'games'],
  
  // Fashion
  'shirt': ['tshirt', 't-shirt', 'top', 'tee', 'blouse', 'polo', 'henley'],
  'pants': ['trousers', 'jeans', 'slacks', 'bottoms', 'chinos', 'joggers', 'leggings'],
  'shoes': ['footwear', 'sneakers', 'boots', 'sandals', 'heels', 'loafers', 'trainers'],
  'bag': ['purse', 'handbag', 'backpack', 'tote', 'clutch', 'satchel', 'messenger'],
  'jacket': ['coat', 'blazer', 'outerwear', 'hoodie', 'sweater', 'cardigan', 'parka'],
  'dress': ['gown', 'frock', 'maxi', 'mini', 'cocktail dress', 'sundress'],
  'accessories': ['jewelry', 'jewellery', 'belt', 'scarf', 'hat', 'sunglasses', 'tie'],
  'underwear': ['innerwear', 'lingerie', 'boxers', 'briefs', 'bra'],
  'sportswear': ['activewear', 'athletic', 'gym wear', 'workout clothes', 'fitness'],
  
  // Home & Living
  'furniture': ['sofa', 'couch', 'chair', 'table', 'bed', 'desk', 'cabinet', 'shelf'],
  'kitchen': ['cookware', 'utensils', 'appliances', 'pots', 'pans', 'blender', 'mixer'],
  'bedding': ['sheets', 'pillow', 'mattress', 'blanket', 'comforter', 'duvet'],
  'decor': ['decoration', 'art', 'vase', 'lamp', 'mirror', 'rug', 'curtains'],
  'storage': ['organizer', 'container', 'basket', 'box', 'rack', 'drawer'],
  
  // Beauty & Personal Care
  'skincare': ['moisturizer', 'serum', 'cleanser', 'lotion', 'cream', 'face wash'],
  'makeup': ['cosmetics', 'lipstick', 'foundation', 'mascara', 'eyeshadow', 'blush'],
  'haircare': ['shampoo', 'conditioner', 'hair oil', 'styling', 'hair dryer'],
  'perfume': ['fragrance', 'cologne', 'scent', 'deodorant', 'body spray'],
  
  // Price/Quality descriptors
  'cheap': ['affordable', 'budget', 'inexpensive', 'low price', 'economical', 'value'],
  'expensive': ['premium', 'luxury', 'high-end', 'designer', 'exclusive'],
  'best': ['top', 'popular', 'trending', 'featured', 'bestseller', 'recommended'],
  'new': ['latest', 'recent', 'fresh', 'arrival', 'just in', '2024', '2025'],
  'sale': ['discount', 'deal', 'offer', 'clearance', 'reduced', 'promotion'],
  
  // Size/Fit
  'small': ['xs', 'extra small', 'petite', 'mini', 'compact'],
  'medium': ['m', 'regular', 'standard'],
  'large': ['l', 'big', 'xl', 'extra large', 'plus size', 'oversized'],
  
  // Colors
  'black': ['dark', 'ebony', 'onyx', 'noir'],
  'white': ['cream', 'ivory', 'pearl', 'snow'],
  'red': ['crimson', 'scarlet', 'burgundy', 'maroon', 'ruby'],
  'blue': ['navy', 'azure', 'cobalt', 'teal', 'cyan', 'indigo'],
  'green': ['olive', 'emerald', 'forest', 'lime', 'sage', 'mint'],
};

// Category concept mapping for semantic search
const categorySemantics = {
  'electronics': ['tech', 'gadget', 'device', 'digital', 'smart', 'wireless', 'bluetooth'],
  'fashion': ['clothing', 'apparel', 'wear', 'style', 'outfit', 'wardrobe'],
  'home': ['house', 'living', 'interior', 'household', 'domestic'],
  'beauty': ['cosmetic', 'personal care', 'grooming', 'wellness', 'self-care'],
  'sports': ['fitness', 'exercise', 'athletic', 'outdoor', 'gym', 'workout'],
  'kids': ['children', 'baby', 'infant', 'toddler', 'youth', 'junior'],
  'books': ['reading', 'literature', 'novel', 'educational', 'learning'],
  'food': ['grocery', 'organic', 'snacks', 'beverages', 'gourmet'],
};

/**
 * Expand search terms using synonym map
 * @param {string} searchTerm - Original search term
 * @returns {string[]} - Array of expanded terms
 */
const expandSearchTerms = (searchTerm) => {
  if (!searchTerm) return [];
  
  const terms = searchTerm.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  const expandedTerms = new Set(terms);
  
  terms.forEach(term => {
    // Direct synonym lookup
    if (synonymMap[term]) {
      synonymMap[term].forEach(syn => expandedTerms.add(syn));
    }
    
    // Reverse lookup - find keys where term appears as a value
    Object.entries(synonymMap).forEach(([key, values]) => {
      if (values.includes(term)) {
        expandedTerms.add(key);
        values.forEach(v => expandedTerms.add(v));
      }
    });
    
    // Category semantic expansion
    Object.entries(categorySemantics).forEach(([category, concepts]) => {
      if (concepts.includes(term) || category.includes(term)) {
        concepts.forEach(c => expandedTerms.add(c));
      }
    });
  });
  
  return Array.from(expandedTerms);
};

/**
 * Calculate semantic similarity score between search terms and product
 * @param {string[]} searchTerms - Expanded search terms
 * @param {Object} product - Product object
 * @returns {number} - Similarity score (0-100)
 */
const calculateSemanticScore = (searchTerms, product) => {
  if (!searchTerms.length || !product) return 0;
  
  let score = 0;
  const maxScore = 100;
  
  // Weights for different matching criteria
  const weights = {
    exactNameMatch: 30,
    partialNameMatch: 15,
    descriptionMatch: 10,
    categoryMatch: 15,
    tagMatch: 20,
    semanticKeywordMatch: 10,
  };
  
  const productName = (product.name || '').toLowerCase();
  const productDesc = (product.description || '').toLowerCase();
  const productCategory = (product.category?.name || '').toLowerCase();
  const productTags = (product.tags || []).map(t => t.toLowerCase());
  const semanticKeywords = (product.semantic_keywords || product.semanticKeywords || []).map(k => k.toLowerCase());
  
  searchTerms.forEach(term => {
    // Exact name match (highest priority)
    if (productName === term) {
      score += weights.exactNameMatch;
    }
    // Partial name match
    else if (productName.includes(term)) {
      score += weights.partialNameMatch;
    }
    
    // Description match
    if (productDesc.includes(term)) {
      score += weights.descriptionMatch;
    }
    
    // Category match
    if (productCategory.includes(term)) {
      score += weights.categoryMatch;
    }
    
    // Tag match
    if (productTags.some(tag => tag.includes(term) || term.includes(tag))) {
      score += weights.tagMatch;
    }
    
    // Semantic keyword match
    if (semanticKeywords.some(kw => kw.includes(term) || term.includes(kw))) {
      score += weights.semanticKeywordMatch;
    }
  });
  
  // Normalize score to max 100
  return Math.min(score, maxScore);
};

/**
 * Generate semantic keywords for a product
 * Used when creating/updating products to enable semantic search
 * @param {Object} product - Product data
 * @returns {string[]} - Array of semantic keywords
 */
const generateSemanticKeywords = (product) => {
  const keywords = new Set();
  
  // Extract keywords from name
  const nameWords = (product.name || '').toLowerCase().split(/\s+/);
  nameWords.forEach(word => {
    if (word.length > 2) {
      keywords.add(word);
      // Add synonyms
      if (synonymMap[word]) {
        synonymMap[word].forEach(syn => keywords.add(syn));
      }
    }
  });
  
  // Extract keywords from description
  const descWords = (product.description || '').toLowerCase().split(/\s+/);
  descWords.forEach(word => {
    if (word.length > 3 && synonymMap[word]) {
      keywords.add(word);
      synonymMap[word].forEach(syn => keywords.add(syn));
    }
  });
  
  // Add category-related semantics
  const categoryName = (product.category?.name || '').toLowerCase();
  Object.entries(categorySemantics).forEach(([cat, concepts]) => {
    if (categoryName.includes(cat)) {
      concepts.forEach(c => keywords.add(c));
    }
  });
  
  // Add tags
  (product.tags || []).forEach(tag => keywords.add(tag.toLowerCase()));
  
  return Array.from(keywords).slice(0, 50); // Limit to 50 keywords
};

/**
 * Perform hybrid search combining keyword and semantic results
 * @param {Object} options - Search options
 * @returns {Object} - Search results with scores
 */
const hybridSearch = async (db, options) => {
  const {
    search,
    categoryId,
    minPrice,
    maxPrice,
    sortBy = 'relevance',
    order = 'DESC',
    page = 1,
    limit = 12,
    includeInactive = false
  } = options;
  
  const { Op } = require('sequelize');
  const offset = (page - 1) * limit;
  
  // Base where clause
  const where = {};
  if (!includeInactive) {
    where.isActive = true;
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = minPrice;
    if (maxPrice) where.price[Op.lte] = maxPrice;
  }
  
  if (!search) {
    // No search term - return standard results
    const { count, rows } = await db.Product.findAndCountAll({
      where,
      include: [{
        model: db.Category,
        as: 'category',
        attributes: ['id', 'name', 'slug']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy === 'relevance' ? 'salesCount' : sortBy, order]],
      distinct: true
    });
    
    return {
      products: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      },
      searchInfo: {
        type: 'standard',
        terms: []
      }
    };
  }
  
  // Expand search terms for semantic matching
  const expandedTerms = expandSearchTerms(search);
  
  // Build keyword search conditions (50% weight)
  const keywordConditions = [];
  expandedTerms.forEach(term => {
    keywordConditions.push({ name: { [Op.iLike]: `%${term}%` } });
    keywordConditions.push({ description: { [Op.iLike]: `%${term}%` } });
  });
  
  // Add semantic keyword array search for PostgreSQL
  const semanticConditions = expandedTerms.map(term => ({
    semantic_keywords: { [Op.contains]: [term] }
  }));
  
  // Combined search
  const searchWhere = {
    ...where,
    [Op.or]: [...keywordConditions]
  };
  
  // Fetch potential matches
  let products = await db.Product.findAll({
    where: searchWhere,
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }],
    limit: 200, // Get more results for scoring
  });
  
  // Calculate hybrid scores for each product
  const scoredProducts = products.map(product => {
    const productData = product.toJSON ? product.toJSON() : product;
    
    // Keyword score (50%) - based on direct matches
    let keywordScore = 0;
    const nameMatch = expandedTerms.some(term => 
      productData.name.toLowerCase().includes(term)
    );
    const descMatch = expandedTerms.some(term => 
      (productData.description || '').toLowerCase().includes(term)
    );
    
    if (nameMatch) keywordScore += 50;
    if (descMatch) keywordScore += 25;
    keywordScore = Math.min(keywordScore, 50);
    
    // Semantic score (50%)
    const semanticScore = calculateSemanticScore(expandedTerms, productData) * 0.5;
    
    // Combine scores
    const totalScore = keywordScore + semanticScore;
    
    return {
      ...productData,
      _relevanceScore: totalScore,
      _keywordScore: keywordScore,
      _semanticScore: semanticScore
    };
  });
  
  // Sort by relevance score
  scoredProducts.sort((a, b) => {
    if (sortBy === 'relevance') {
      return b._relevanceScore - a._relevanceScore;
    }
    // Apply other sort options
    if (sortBy === 'price') {
      return order === 'ASC' 
        ? parseFloat(a.price) - parseFloat(b.price)
        : parseFloat(b.price) - parseFloat(a.price);
    }
    if (sortBy === 'name') {
      return order === 'ASC'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortBy === 'createdAt') {
      return order === 'ASC'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    return b._relevanceScore - a._relevanceScore;
  });
  
  // Paginate results
  const total = scoredProducts.length;
  const paginatedProducts = scoredProducts.slice(offset, offset + parseInt(limit));
  
  return {
    products: paginatedProducts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    searchInfo: {
      type: 'hybrid',
      originalQuery: search,
      expandedTerms: expandedTerms.slice(0, 20), // Show first 20 terms
      termCount: expandedTerms.length
    }
  };
};

module.exports = {
  expandSearchTerms,
  calculateSemanticScore,
  generateSemanticKeywords,
  hybridSearch,
  synonymMap,
  categorySemantics
};
