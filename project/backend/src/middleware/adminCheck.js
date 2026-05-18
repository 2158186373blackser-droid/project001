const { User } = require('../models');

/**
 * 管理员权限验证中间件
 * 仅 username === 'admin' 的用户可通过
 */
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user || user.username !== 'admin') {
      return res.status(403).json({ code: 403, msg: '无管理员权限' });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { isAdmin };