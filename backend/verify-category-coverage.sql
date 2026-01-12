-- ============================================================================
-- CATEGORY PRODUCT COUNT VERIFICATION
-- ============================================================================
-- This query shows all categories (parent and subcategories) with their
-- product counts. REQUIREMENT: Every category should have >= 8 products
-- ============================================================================

WITH category_products AS (
  SELECT 
    c.id,
    c.name,
    c."parentId",
    CASE WHEN c."parentId" IS NULL THEN 'Parent' ELSE 'Subcategory' END as type,
    COUNT(p.id) as product_count,
    CASE 
      WHEN COUNT(p.id) >= 8 THEN '✓ PASS'
      WHEN COUNT(p.id) >= 5 THEN '⚠ WARNING'
      ELSE '✗ FAIL'
    END as status
  FROM categories c
  LEFT JOIN products p ON p."categoryId" = c.id AND p."isActive" = true
  WHERE c."isActive" = true
  GROUP BY c.id, c.name, c."parentId"
)
SELECT 
  id,
  name,
  type,
  product_count,
  status
FROM category_products
ORDER BY 
  CASE WHEN "parentId" IS NULL THEN id ELSE "parentId" END,
  "parentId" NULLS FIRST,
  id;

-- ============================================================================
-- SUMMARY STATISTICS
-- ============================================================================
SELECT 
  'Total Active Categories' as metric,
  COUNT(*) as value
FROM categories
WHERE "isActive" = true
UNION ALL
SELECT 
  'Categories with < 8 products' as metric,
  COUNT(*) as value
FROM (
  SELECT c.id, COUNT(p.id) as cnt
  FROM categories c
  LEFT JOIN products p ON p."categoryId" = c.id AND p."isActive" = true
  WHERE c."isActive" = true
  GROUP BY c.id
  HAVING COUNT(p.id) < 8
) sub
UNION ALL
SELECT 
  'Total Active Products' as metric,
  COUNT(*) as value
FROM products
WHERE "isActive" = true;

-- ============================================================================
-- CATEGORIES NEEDING ATTENTION (if any have < 8 products)
-- ============================================================================
SELECT 
  c.id,
  c.name,
  c.slug,
  COUNT(p.id) as current_product_count,
  8 - COUNT(p.id) as products_needed
FROM categories c
LEFT JOIN products p ON p."categoryId" = c.id AND p."isActive" = true
WHERE c."isActive" = true
GROUP BY c.id, c.name, c.slug
HAVING COUNT(p.id) < 8
ORDER BY COUNT(p.id) ASC, c.id;

-- ============================================================================
-- PARENT CATEGORY ROLLUP (includes subcategory products)
-- ============================================================================
SELECT 
  parent.id,
  parent.name as parent_category,
  COUNT(DISTINCT p.id) as total_products_in_tree
FROM categories parent
LEFT JOIN categories child ON child."parentId" = parent.id
LEFT JOIN products p ON p."categoryId" IN (parent.id, child.id) AND p."isActive" = true
WHERE parent."parentId" IS NULL AND parent."isActive" = true
GROUP BY parent.id, parent.name
ORDER BY parent.id;
