const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth'); // 修正：取消解构

const {
  publishGoods,
  getGoodsList,
  getGoodsDetail,
  buyGoods,
  shelveGoods
} = require('../controllers/goodsController');

router.get('/list', authMiddleware, getGoodsList);
router.get('/:id', authMiddleware, getGoodsDetail);
router.post('/publish', authMiddleware, publishGoods);
router.post('/:id/buy', authMiddleware, buyGoods);
router.post('/:id/shelve', authMiddleware, shelveGoods);

module.exports = router;