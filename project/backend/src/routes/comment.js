const express = require('express');
// mergeParams: true 允许该路由访问父路由中定义的参数（例如 :postId）
const router = express.Router({ mergeParams: true });

const { authMiddleware } = require('../middleware/auth');
const {
  createComment,
  getCommentList,   // 注意：控制器中实际导出的是 getCommentList
  deleteComment,
  reportComment
} = require('../controllers/commentController');

// ============================================================
// 路由前缀说明：
// 该文件在 routes/index.js 中被挂载到了 /post 路径下
// 例如：router.use('/post', commentRoutes)
// 因此以下路由的完整路径为：
//   POST   /api/post/:postId/comment
//   GET    /api/post/:postId/comment
//   DELETE /api/post/:postId/comment/:id
//   POST   /api/post/:postId/comment/:id/report
// ============================================================

// 发表评论
// 请求体：{ content, parentId? }
router.post('/:postId/comment', authMiddleware, createComment);

// 获取帖子评论列表
// 查询参数：page, pageSize
router.get('/:postId/comment', getCommentList);   // 这里改用 getCommentList

// 删除评论（软删除）
// 路径参数：:postId 和 :id（评论ID）
router.delete('/:postId/comment/:id', authMiddleware, deleteComment);

// 举报评论
// 请求体：{ reason, description? }
router.post('/:postId/comment/:id/report', authMiddleware, reportComment);

module.exports = router;