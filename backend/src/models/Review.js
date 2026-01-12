'use strict';

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
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
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'orders',
        key: 'id'
      },
      comment: 'Link to verified purchase order'
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        isInt: true
      }
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isVerifiedPurchase: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'True if user actually purchased this product'
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Admin approval status'
    },
    helpfulCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of users who found this review helpful'
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Array of image URLs uploaded with review'
    },
    adminResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Admin/seller response to the review'
    },
    adminResponseAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: 'reviews',
    timestamps: true,
    indexes: [
      {
        fields: ['productId']
      },
      {
        fields: ['userId']
      },
      {
        unique: true,
        fields: ['userId', 'productId'],
        name: 'unique_user_product_review'
      },
      {
        fields: ['rating']
      },
      {
        fields: ['isVerifiedPurchase']
      },
      {
        fields: ['isApproved']
      }
    ]
  });

  Review.associate = function(models) {
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Review.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
    Review.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order'
    });
  };

  return Review;
};
