const { User, UserCredit, OperationLog } = require('../../models');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');
const { logOperation } = require('../../utils/logHelper');

/**
 * 获取用户列表
 * @description 支持用户名/邮箱搜索和状态筛选
 */
const getUsers = async (req, res, next) => {
  try {
    const { keyword, status, page = 1, pageSize = 20 } = req.query;
    const where = {};
    
    if (keyword) {
      where[Op.or] = [
        { username: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } }
      ];
    }
    if (status) {
      where.status = status;
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: ['id', 'username', 'email', 'status', 'createdAt'],
      include: [{
        model: UserCredit,
        attributes: ['absentCount']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(pageSize),
      offset: (parseInt(page) - 1) * parseInt(pageSize)
    });

    res.json({
      code: 200,
      data: { list: rows, total: count }
    });
  } catch (error) {
    logger.error('获取用户列表错误:', error);
    next(error);
  }
};

/**
 * 封禁/解封用户
 */
const toggleBan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.userId; 
    const user = await User.findByPk(id);
    
    if (!user) return res.status(404).json({ code: 404, msg: '用户不存在' });
    
    const oldStatus = user.status;
    const newStatus = user.status === 'active' ? 'banned' : 'active';
    
    user.status = newStatus;
    await user.save();

    // 记录日志
    await logOperation(req, {
      adminId,
      operationType: newStatus === 'banned' ? '封禁用户' : '解封用户',
      targetType: 'User',
      targetId: id,
      before: { status: oldStatus },
      after: { status: newStatus }
    });

    res.json({ code: 200, msg: '操作成功', data: { status: newStatus } });
  } catch (error) {
    logger.error('状态修改错误:', error);
    next(error);
  }
};

/**
 * 重置爽约次数
 */
const resetAbsence = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.userId;
    const credit = await UserCredit.findOne({ where: { userId: id } });
    
    if (!credit) return res.status(404).json({ code: 404, msg: '该用户没有信用记录' });
    
    const oldAbsentCount = credit.absentCount;
    credit.absentCount = 0;
    await credit.save();

    // 记录日志
    await logOperation(req, {
      adminId,
      operationType: '重置爽约次数',
      targetType: 'UserCredit',
      targetId: id,
      before: { absentCount: oldAbsentCount },
      after: { absentCount: 0 }
    });

    res.json({ code: 200, msg: '重置成功' });
  } catch (error) {
    logger.error('重置次数错误:', error);
    next(error);
  }
};

// 确保这三个函数都已经定义好，然后再导出
module.exports = { getUsers, toggleBan, resetAbsence };