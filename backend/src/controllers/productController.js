const db = require('../models');
const { asyncHandler } = require('../middleware/error');
const { Op } = require('sequelize');
const { hybridSearch, generateSemanticKeywords, getCategoryWithChildren } = require('../utils/hybridSearch');

/**
 * Get products with hybrid search (keyword + semantic)
 * When search param is provided, uses hybrid search combining:
 * - 50% keyword-based matching (SQL LIKE)
 * - 50% semantic similarity (synonym expansion + concept matching)
 */
const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    categoryId,
    search,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    order = 'DESC',
    featured,
    includeInactive
  } = req.query;

  const isAdmin = req.admin !== undefined;

  // Use hybrid search when search term is provided
  if (search) {
    const results = await hybridSearch(db, {
      search,
      categoryId,
      minPrice,
      maxPrice,
      sortBy,
      order,
      page,
      limit,
      includeInactive: isAdmin && includeInactive === 'true'
    });

    return res.json({
      success: true,
      ...results
    });
  }

  // Standard product listing (no search)
  const offset = (page - 1) * limit;
  const where = {};

  if (!isAdmin && includeInactive !== 'true') {
    where.isActive = true;
  }

  // Handle category filtering - include child categories if parent is selected
  if (categoryId) {
    const categoryIds = await getCategoryWithChildren(db, categoryId);
    if (categoryIds && categoryIds.length > 0) {
      where.categoryId = categoryIds.length === 1 ? categoryIds[0] : { [Op.in]: categoryIds };
    }
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = minPrice;
    if (maxPrice) where.price[Op.lte] = maxPrice;
  }

  if (featured === 'true') {
    where.isFeatured = true;
  }

  const { count, rows: products } = await db.Product.findAndCountAll({
    where,
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[sortBy, order]],
    distinct: true
  });

  res.json({
    success: true,
    products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: Math.ceil(count / limit)
    }
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await db.Product.findOne({
    where: { id: req.params.id, isActive: true },
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }]
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  await product.increment('viewCount');

  res.json({
    success: true,
    product
  });
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await db.Product.findOne({
    where: { slug: req.params.slug, isActive: true },
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }]
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  await product.increment('viewCount');

  res.json({
    success: true,
    product
  });
});

const getRecommendations = asyncHandler(async (req, res) => {
  const product = await db.Product.findByPk(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const relatedProducts = await db.Product.findAll({
    where: {
      categoryId: product.categoryId,
      id: { [Op.ne]: product.id },
      isActive: true
    },
    order: [['salesCount', 'DESC']],
    limit: 4,
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }]
  });

  const trendingProducts = await db.Product.findAll({
    where: {
      isActive: true,
      id: { [Op.ne]: product.id }
    },
    order: [['salesCount', 'DESC']],
    limit: 4,
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }]
  });

  res.json({
    success: true,
    recommendations: {
      related: relatedProducts,
      trending: trendingProducts
    }
  });
});

const createProduct = asyncHandler(async (req, res) => {
  // Generate semantic keywords for hybrid search
  const productData = { ...req.body };
  
  // Create product first
  const product = await db.Product.create(productData);
  
  // Fetch with category for semantic keyword generation
  const productWithCategory = await db.Product.findByPk(product.id, {
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }]
  });
  
  // Generate and save semantic keywords
  const semanticKeywords = generateSemanticKeywords(productWithCategory);
  await product.update({ semantic_keywords: semanticKeywords });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product: productWithCategory
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await db.Product.findByPk(req.params.id, {
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }]
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  await product.update(req.body);
  
  // Regenerate semantic keywords after update
  const updatedProduct = await db.Product.findByPk(req.params.id, {
    include: [{
      model: db.Category,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }]
  });
  
  const semanticKeywords = generateSemanticKeywords(updatedProduct);
  await updatedProduct.update({ semantic_keywords: semanticKeywords });

  res.json({
    success: true,
    message: 'Product updated successfully',
    product: updatedProduct
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await db.Product.findByPk(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  await product.update({ isActive: false });

  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  getRecommendations,
  createProduct,
  updateProduct,
  deleteProduct
};
