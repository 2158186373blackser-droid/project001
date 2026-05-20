const express = require('express');
const router = express.Router();
// 修正：取消解构，直接引入
const authMiddleware = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/adminCheck');
const { getStats } = require('../../controllers/admin/dashboardController');

router.get('/stats', authMiddleware, isAdmin, getStats);

module.exports = router;