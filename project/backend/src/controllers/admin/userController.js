const { User } = require('../../models');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');

const getUsers = async (req, res, next) => {
  try {
    const { keyword, page = 1, pageSize = 10 } = req.query;
    const where = {};
    if (keyword) {
      where[Op.or] = [
        { username: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: ['id', 'username', 'email', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: parseInt(pageSize),
      offset: (parseInt(page) - 1) * parseInt(pageSize)
    });

    res.json({
      code: 200,
      data: { list: rows, total: count, page: parseInt(page), pageSize: parseInt(pageSize) }
    });
  } catch (error) {
    logger.error('获取用户列表错误:', error);
    next(error);
  }
};

const toggleBan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ code: 404, msg: '用户不存在' });
    }
    user.status = user.status === 'active' ? 'banned' : 'active';
    await user.save();
    res.json({ code: 200, msg: '操作成功', data: { status: user.status } });
  } catch (error) {
    logger.error('封禁用户错误:', error);
    next(error);
  }
};

module.exports = { getUsers, toggleBan };