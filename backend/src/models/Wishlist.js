'use strict';

module.exports = (sequelize, DataTypes) => {
  const Wishlist = sequelize.define('Wishlist', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
  }, {
    tableName: 'wishlists',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'productId'],
      },
    ],
  });

  Wishlist.associate = function(models) {
    Wishlist.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Wishlist.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  };

  return Wishlist;
};
