const jwt = require('jsonwebtoken');
const redis = require('../config/redis');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ code: 401, msg: '未提供认证令牌' });
    
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) return res.status(401).json({ code: 401, msg: '令牌已失效' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.username = decoded.username;
    next();
  } catch (error) {
    return res.status(401).json({ code: 401, msg: '认证失败' });
  }
};

// 【关键修改】：不再使用花括号，直接导出函数
module.exports = authMiddleware;