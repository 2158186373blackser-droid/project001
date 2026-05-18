const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/adminCheck');
const { getUsers, toggleBan } = require('../../controllers/admin/userController');

router.get('/', authMiddleware, isAdmin, getUsers);
router.put('/:id/ban', authMiddleware, isAdmin, toggleBan);  // 或使用 POST

module.exports = router;