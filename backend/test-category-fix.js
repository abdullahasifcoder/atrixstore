/**
 * Test script to verify category filtering includes child categories
 * Run: node test-category-fix.js
 */

require('dotenv').config();
const db = require('./src/models');
const { getCategoryWithChildren } = require('./src/utils/hybridSearch');

async function testCategoryFix() {
  try {
    console.log('🧪 Testing Category Filtering Fix\n');
    console.log('='.repeat(60));

    // Test 1: Get parent category (Electronics - ID 1)
    console.log('\n📦 Test 1: Parent Category - Electronics (ID: 1)');
    const electronicsIds = await getCategoryWithChildren(db, 1);
    console.log('Category IDs (parent + children):', electronicsIds);
    
    // Count products in all Electronics subcategories
    const electronicsProducts = await db.Product.count({
      where: {
        categoryId: { [db.Sequelize.Op.in]: electronicsIds },
        isActive: true
      }
    });
    console.log(`✅ Total products in Electronics: ${electronicsProducts}`);

    // Test 2: Get specific subcategory (Smartphones - ID 101)
    console.log('\n📱 Test 2: Subcategory - Smartphones (ID: 101)');
    const smartphoneIds = await getCategoryWithChildren(db, 101);
    console.log('Category IDs:', smartphoneIds);
    
    const smartphoneProducts = await db.Product.count({
      where: {
        categoryId: { [db.Sequelize.Op.in]: smartphoneIds },
        isActive: true
      }
    });
    console.log(`✅ Total products in Smartphones: ${smartphoneProducts}`);

    // Test 3: List all parent categories with product counts
    console.log('\n📊 Test 3: All Parent Categories with Product Counts');
    console.log('-'.repeat(60));
    
    const parentCategories = await db.Category.findAll({
      where: { parentId: null, isActive: true },
      order: [['sortOrder', 'ASC']]
    });

    for (const category of parentCategories) {
      const categoryIds = await getCategoryWithChildren(db, category.id);
      const productCount = await db.Product.count({
        where: {
          categoryId: { [db.Sequelize.Op.in]: categoryIds },
          isActive: true
        }
      });
      
      const icon = productCount > 0 ? '✅' : '❌';
      console.log(`${icon} ${category.name.padEnd(25)} - ${productCount} products`);
    }

    // Test 4: Get child categories for Electronics
    console.log('\n🔍 Test 4: Child Categories of Electronics');
    console.log('-'.repeat(60));
    
    const electronicsChildren = await db.Category.findAll({
      where: { parentId: 1, isActive: true },
      order: [['sortOrder', 'ASC']]
    });

    for (const child of electronicsChildren) {
      const productCount = await db.Product.count({
        where: { categoryId: child.id, isActive: true }
      });
      console.log(`  - ${child.name.padEnd(25)} (ID: ${child.id}) - ${productCount} products`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await db.sequelize.close();
  }
}

testCategoryFix();
