const { OperationLog, User } = require('../models');
const logger = require('./logger');

const logOperation = async (req, { adminId, operationType, targetType, targetId, before, after }) => {
  try {
    const admin = await User.findByPk(adminId, { attributes: ['username'] });
    const adminUsername = admin ? admin.username : 'Unknown';

    await OperationLog.create({
      adminId,
      adminUsername, // 👈 确保这里传给了模型
      operationType,
      targetType,
      targetId,
      ipAddress: req.ip || req.connection.remoteAddress,
      beforeSnapshot: JSON.stringify(before),
      afterSnapshot: JSON.stringify(after),
      createdAt: new Date()
    });
  } catch (error) {
    logger.error('写入操作日志失败:', error);
  }
};

module.exports = { logOperation };