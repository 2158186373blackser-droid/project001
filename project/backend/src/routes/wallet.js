const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getWallet, getTransactions } = require('../controllers/walletController');

/**
 * 禁用浏览器缓存中间件
 * 解决钱包/交易数据刷新后仍显示旧值的问题
 */
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// 获取钱包信息（余额）
router.get('/', authMiddleware, getWallet);

// 获取交易记录
router.get('/transactions', authMiddleware, getTransactions);

module.exports = router;