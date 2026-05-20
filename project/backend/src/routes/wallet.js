const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // 修正：取消解构
const { getWallet, getTransactions } = require('../controllers/walletController');

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

router.get('/', authMiddleware, getWallet);
router.get('/transactions', authMiddleware, getTransactions);

module.exports = router;