'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add rating column
    await queryInterface.addColumn('products', 'rating', {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: true,
      defaultValue: 0
    });

    // Add reviewCount column
    await queryInterface.addColumn('products', 'reviewCount', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    });

    // Add index on rating
    await queryInterface.addIndex('products', ['rating']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'rating');
    await queryInterface.removeColumn('products', 'reviewCount');
  }
};
