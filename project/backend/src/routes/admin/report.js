const express = require('express');
const router = express.Router();
// 修正：取消花括号解构，直接引入中间件
const authMiddleware = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/adminCheck');
const {
  getReports,
  getReportDetail,
  handleReport
} = require('../../controllers/admin/reportController');

router.get('/', authMiddleware, isAdmin, getReports);
router.get('/:id', authMiddleware, isAdmin, getReportDetail);
router.put('/:id/handle', authMiddleware, isAdmin, handleReport);

module.exports = router;