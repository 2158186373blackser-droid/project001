const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/adminCheck');
const {
  getReports,
  getReportDetail,
  handleReport
} = require('../../controllers/admin/reportController');

router.get('/', authMiddleware, isAdmin, getReports);
router.get('/:id', authMiddleware, isAdmin, getReportDetail);
router.put('/:id/handle', authMiddleware, isAdmin, handleReport);  // 注意前端可能用POST，但建议PUT

module.exports = router;