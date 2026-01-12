'use strict';

/**
 * Migration to add embedding support for hybrid search
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add search_vector column for PostgreSQL full-text search
    await queryInterface.addColumn('products', 'search_vector', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // Add semantic keywords - extracted important terms for better matching
    await queryInterface.addColumn('products', 'semantic_keywords', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
      allowNull: true
    });

    // Create GIN index for array search if using PostgreSQL
    try {
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_products_semantic_keywords 
        ON products USING GIN (semantic_keywords);
      `);
    } catch (error) {
      console.log('GIN index creation skipped (may not be supported):', error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'search_vector');
    await queryInterface.removeColumn('products', 'semantic_keywords');
  }
};
