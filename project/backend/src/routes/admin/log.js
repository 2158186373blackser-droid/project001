const express = require('express');
const router = express.Router();
// 修正：取消花括号解构，直接引入中间件
const authMiddleware = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/adminCheck');
const { getLogs } = require('../../controllers/admin/operationLogController');

router.get('/', authMiddleware, isAdmin, getLogs);

module.exports = router;