const express = require('express');
const router = express.Router({ mergeParams: true });

const authMiddleware = require('../middleware/auth'); // 修正：取消解构
const {
  createComment,
  getCommentList,
  deleteComment,
  reportComment
} = require('../controllers/commentController');

router.post('/:postId/comment', authMiddleware, createComment);
router.get('/:postId/comment', getCommentList);
router.delete('/:postId/comment/:id', authMiddleware, deleteComment);
router.post('/:postId/comment/:id/report', authMiddleware, reportComment);

module.exports = router;