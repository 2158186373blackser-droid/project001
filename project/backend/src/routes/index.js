const express = require('express');
const router = express.Router();

// 引入各业务路由
const authRoutes = require('./auth');
const goodsRoutes = require('./goods');
const orderRoutes = require('./order');
const libraryRoutes = require('./library');
const newsRoutes = require('./news');
const postRoutes = require('./post');
const commentRoutes = require('./comment');
const walletRoutes = require('./wallet');

// ==================== 挂载路由 ====================
// 认证相关
router.use('/auth', authRoutes);
router.use('/', authRoutes); // 兼容直接访问

// 二手市场
router.use('/goods', goodsRoutes);

// 代取快递
router.use('/order', orderRoutes);

// 图书馆占座
router.use('/library', libraryRoutes);

// 新闻资讯
router.use('/news', newsRoutes);

// 论坛帖子
router.use('/post', postRoutes);

// 论坛评论（挂载到 /post 下，匹配 /api/post/:postId/comment）
router.use('/post', commentRoutes);

// 钱包
router.use('/wallet', walletRoutes);

// API文档路由
router.get('/docs', (req, res) => {
  res.json({
    name: '校园服务平台API',
    version: '1.0.0',
    endpoints: {
      captcha: { 'GET /captcha': '获取图形验证码', 'POST /captcha/verify': '验证验证码' },
      auth: { 'POST /register': '用户注册', 'POST /login': '用户登录' },
      goods: { 'GET /goods/list': '商品列表', 'POST /goods/publish': '发布商品' },
      order: { 'GET /order/list': '订单列表', 'POST /order/publish': '发布订单' },
      library: { 'GET /library/seats': '座位查询', 'POST /library/book': '预约座位' },
      news: { 'GET /news/list': '新闻列表' },
      post: { 'GET /post/list': '帖子列表', 'POST /post': '发布帖子' },
      comment: { 'POST /post/:postId/comment': '发表评论', 'GET /post/:postId/comment': '获取评论' },
      wallet: { 'GET /wallet': '我的钱包' }
    }
  });
});

// 健康检查
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

module.exports = router;
const adminRoutes = require('./admin/index');
router.use('/admin', adminRoutes);