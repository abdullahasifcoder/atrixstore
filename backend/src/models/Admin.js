'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'Username already exists',
      },
      validate: {
        notEmpty: { msg: 'Username is required' },
        len: {
          args: [3, 100],
          msg: 'Username must be between 3 and 100 characters',
        },
        isAlphanumeric: {
          msg: 'Username must contain only letters and numbers',
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        msg: 'Email address already in use',
      },
      validate: {
        isEmail: { msg: 'Must be a valid email address' },
        notEmpty: { msg: 'Email is required' },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password is required' },
        len: {
          args: [8],
          msg: 'Password must be at least 8 characters',
        },
      },
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'admin', 'moderator'),
      defaultValue: 'admin',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'admins',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
      {
        unique: true,
        fields: ['username'],
      },
    ],
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.password) {
          const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
          admin.password = await bcrypt.hash(admin.password, saltRounds);
        }
      },
      beforeUpdate: async (admin) => {
        if (admin.changed('password')) {
          const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
          admin.password = await bcrypt.hash(admin.password, saltRounds);
        }
      },
    },
  });

  Admin.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  Admin.prototype.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
  };

  Admin.prototype.toSafeObject = function() {
    const { password, ...safeAdmin } = this.toJSON();
    return safeAdmin;
  };

  return Admin;
};
