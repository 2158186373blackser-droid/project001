// D:\Vue\project\backend\src\routes\message.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// 【完整覆盖】直接引入 authMiddleware 函数
const auth = require('../middleware/auth'); 

router.get('/', auth, messageController.getMessageList);
router.put('/:id/read', auth, messageController.markAsRead);

module.exports = router;