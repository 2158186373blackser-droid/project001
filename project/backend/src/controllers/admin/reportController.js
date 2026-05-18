const { Report, User, Comment, Post } = require('../../models');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');

const getReports = async (req, res, next) => {
  try {
    const { status, page = 1, pageSize = 10 } = req.query;
    const where = {};
    if (status) where.status = status;

    const { count, rows } = await Report.findAndCountAll({
      where,
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'username'] },
        { model: Comment, attributes: ['id', 'content'] },
        { model: Post, attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(pageSize),
      offset: (parseInt(page) - 1) * parseInt(pageSize)
    });

    res.json({
      code: 200,
      data: { list: rows, total: count, page: parseInt(page), pageSize: parseInt(pageSize) }
    });
  } catch (error) {
    logger.error('获取举报列表错误:', error);
    next(error);
  }
};

const getReportDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await Report.findByPk(id, {
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'username'] },
        { model: Comment, attributes: ['id', 'content'] },
        { model: Post, attributes: ['id', 'title'] }
      ]
    });
    if (!report) {
      return res.status(404).json({ code: 404, msg: '举报不存在' });
    }
    res.json({ code: 200, data: report });
  } catch (error) {
    logger.error('获取举报详情错误:', error);
    next(error);
  }
};

const handleReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, banUser } = req.body;
    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ code: 404, msg: '举报不存在' });
    }
    if (report.status !== 'pending') {
      return res.status(400).json({ code: 400, msg: '该举报已处理' });
    }

    report.status = action === 'approve' ? 'approved' : 'rejected';
    report.handledAt = new Date();
    await report.save();

    if (action === 'approve' && banUser) {
      const user = await User.findByPk(report.reportedUserId);
      if (user) {
        user.status = 'banned';
        await user.save();
      }
    }

    res.json({ code: 200, msg: '处理成功' });
  } catch (error) {
    logger.error('处理举报错误:', error);
    next(error);
  }
};

module.exports = { getReports, getReportDetail, handleReport };