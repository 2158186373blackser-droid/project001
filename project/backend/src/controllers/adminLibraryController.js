const jwt = require('jsonwebtoken');
const { Booking } = require('../models');
const logger = require('../utils/logger');

/**
 * 管理员核销二维码（替用户签到）
 * POST /api/admin/library/verify
 * Body: { token }
 */
const verifyQRCode = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ code: 400, msg: '缺少核销令牌' });
    }

    // 验证 Token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(400).json({ code: 400, msg: '二维码已过期（超过预约开始时间）' });
      }
      return res.status(400).json({ code: 400, msg: '无效的核销令牌' });
    }

    const { bookingId, userId } = decoded;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ code: 404, msg: '预约不存在' });
    }

    if (booking.status !== 'booked') {
      return res.status(400).json({ code: 400, msg: `预约状态为 ${booking.status}，无法核销` });
    }

    const now = new Date();
    if (now > new Date(booking.startTime)) {
      return res.status(400).json({ code: 400, msg: '已超过预约开始时间，无法核销' });
    }

    booking.status = 'checked_in';
    booking.checkInTime = now;
    await booking.save();

    logger.info(`管理员核销预约 ${bookingId}，用户 ${userId}`);
    res.json({ code: 200, msg: '核销成功' });
  } catch (error) {
    logger.error('核销错误:', error);
    next(error);
  }
};

module.exports = { verifyQRCode };