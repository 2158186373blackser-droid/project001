const express = require('express');
const router = express.Router();
// 修正：取消花括号解构，直接引入中间件
const authMiddleware = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/adminCheck');
const { getUsers, toggleBan, resetAbsence } = require('../../controllers/admin/userController');

router.get('/', authMiddleware, isAdmin, getUsers);
router.post('/:id/ban', authMiddleware, isAdmin, toggleBan);
// 添加 unban 路由，让它指向同一个 toggleBan 控制器
router.post('/:id/unban', authMiddleware, isAdmin, toggleBan); 
router.post('/:id/reset-absence', authMiddleware, isAdmin, resetAbsence);

module.exports = router;