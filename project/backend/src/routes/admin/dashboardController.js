const { User, Order, Goods, Post, Report } = require('../../models');
const logger = require('../../utils/logger');

const getStats = async (req, res, next) => {
  try {
    const [userCount, orderCount, goodsCount, postCount, reportCount] = await Promise.all([
      User.count(),
      Order.count(),
      Goods.count(),
      Post.count({ where: { isDeleted: false } }),
      Report.count({ where: { status: 'pending' } })
    ]);
    res.json({
      code: 200,
      data: {
        totalUsers: userCount,
        totalPosts: postCount,
        pendingReports: reportCount,
        onlineGoods: goodsCount
      }
    });
  } catch (error) {
    logger.error('仪表盘统计错误:', error);
    next(error);
  }
};

module.exports = { getStats };