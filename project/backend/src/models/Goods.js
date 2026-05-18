const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Goods 模型 - 二手市场商品表
 */
const Goods = sequelize.define('Goods', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'seller_id',
    references: { model: 'users', key: 'id' }
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0.01, max: 9999 }
  },
  category: {
    type: DataTypes.ENUM('书籍资料', '电子产品', '生活用品', '服装鞋帽', '其他'),
    allowNull: false
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('active', 'sold', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  },
  viewCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'view_count'
  }
}, {
  tableName: 'goods',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['seller_id'] },
    { fields: ['status'] },
    { fields: ['category'] }
  ]
});

// 关联已在 models/index.js 中定义，此处不再重复

module.exports = Goods;