const { OperationLog, User } = require('../../models');
const logger = require('../../utils/logger');

const getLogs = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    const { count, rows } = await OperationLog.findAndCountAll({
      // 🚨 核心修复：在 include 中显式声明模型关联时定义的别名 as: 'admin'
      include: [{ model: User, as: 'admin', attributes: ['id', 'username'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(pageSize),
      offset: (parseInt(page) - 1) * parseInt(pageSize)
    });

    res.json({
      code: 200,
      data: {
        list: rows,
        total: count,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    logger.error('获取操作日志错误:', error);
    next(error);
  }
};

module.exports = { getLogs };