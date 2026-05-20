const express = require('express');
const router = express.Router();
// 修复：去掉花括号，直接引入默认导出的中间件
const authMiddleware = require('../middleware/auth');
const {
  getSeats,
  bookSeat,
  checkIn,
  cancelBooking,      // 取消预约
  getMyBookings,
  getCredit,
  submitAppeal
} = require('../controllers/libraryController');

// 获取可用座位
router.get('/seats', authMiddleware, getSeats);

// 预约座位
router.post('/book', authMiddleware, bookSeat);

// 签到
router.post('/checkin/:id', authMiddleware, checkIn);

// 取消预约 (DELETE 方法)
router.delete('/cancel/:id', authMiddleware, cancelBooking);

// 获取我的预约
router.get('/my', authMiddleware, getMyBookings);

// 获取信用信息
router.get('/credit', authMiddleware, getCredit);

// 提交申诉
router.post('/appeal', authMiddleware, submitAppeal);

module.exports = router;