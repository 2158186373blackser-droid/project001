const express = require('express');
const router = express.Router();
// 修复：取消对象解构，直接引入默认导出的中间件
const authMiddleware = require('../middleware/auth');
const {
  publishOrder,
  getOrderList,
  getOrderDetail,
  acceptOrder,
  confirmPickup,
  confirmDelivery,
  confirmComplete,
  fileComplaint
} = require('../controllers/orderController');

router.post('/publish', authMiddleware, publishOrder);
router.get('/list', authMiddleware, getOrderList);
router.get('/:id', authMiddleware, getOrderDetail);
router.post('/:id/accept', authMiddleware, acceptOrder);
router.post('/:id/pickup', authMiddleware, confirmPickup);
router.post('/:id/delivery', authMiddleware, confirmDelivery);
router.post('/:id/complete', authMiddleware, confirmComplete);
router.post('/:id/complaint', authMiddleware, fileComplaint);

module.exports = router;