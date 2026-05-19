const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OperationLog = sequelize.define('OperationLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  adminId: { type: DataTypes.INTEGER, allowNull: false, field: 'admin_id' },
  // 🚨 添加这一行：映射数据库中的 admin_username 列
  adminUsername: { type: DataTypes.STRING, allowNull: false, field: 'admin_username' },
  operationType: { type: DataTypes.STRING(255), allowNull: false, field: 'operation_type' },
  targetType: { type: DataTypes.STRING(50), allowNull: true, field: 'target_type' },
  targetId: { type: DataTypes.INTEGER, allowNull: true, field: 'target_id' },
  ipAddress: { type: DataTypes.STRING(45), allowNull: true, field: 'ip_address' },
  beforeSnapshot: { type: DataTypes.TEXT, allowNull: true, field: 'before_snapshot' },
  afterSnapshot: { type: DataTypes.TEXT, allowNull: true, field: 'after_snapshot' }
}, {
  tableName: 'operation_logs',
  timestamps: true,
  updatedAt: false, // 之前定义的禁用更新时间
  underscored: true
});

OperationLog.associate = (models) => {
  OperationLog.belongsTo(models.User, { foreignKey: 'adminId', as: 'admin' });
};

module.exports = OperationLog;