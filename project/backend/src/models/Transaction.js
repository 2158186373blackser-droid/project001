const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Transaction 模型 - 交易记录表
 * 字段说明：
 *   id            主键
 *   fromUserId    付款方用户 ID（可为空，如充值）
 *   toUserId      收款方用户 ID
 *   amount        金额（DECIMAL 高精度）
 *   type          类型：payment(购买)、recharge(充值)、withdraw(提现) 等
 *   status        状态：success / failed / pending
 *   remark        备注
 */
const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fromUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,               // 系统操作时可为空
    field: 'from_user_id',
    references: { model: 'users', key: 'id' }
  },
  toUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'to_user_id',
    references: { model: 'users', key: 'id' }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0.01 }
  },
  type: {
    type: DataTypes.ENUM('payment', 'recharge', 'withdraw', 'refund', 'transfer'),
    allowNull: false,
    defaultValue: 'payment'
  },
  status: {
    type: DataTypes.ENUM('success', 'failed', 'pending'),
    allowNull: false,
    defaultValue: 'success'
  },
  remark: {
    type: DataTypes.STRING(200),
    allowNull: true
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['from_user_id'] },
    { fields: ['to_user_id'] },
    { fields: ['type'] }
  ]
});

/**
 * 模型关联定义
 * 在 models/index.js 中统一调用
 */
Transaction.associate = (models) => {
  // 付款方
  Transaction.belongsTo(models.User, {
    foreignKey: 'fromUserId',
    as: 'fromUser'          // 查询时使用 include: [{ model: User, as: 'fromUser' }]
  });
  // 收款方
  Transaction.belongsTo(models.User, {
    foreignKey: 'toUserId',
    as: 'toUser'
  });
};

module.exports = Transaction;