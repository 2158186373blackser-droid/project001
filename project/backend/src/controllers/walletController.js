const { Op } = require('sequelize');   // 补充导入 Op
const { Wallet, Transaction, User } = require('../models');
const logger = require('../utils/logger');

/**
 * 获取当前用户的钱包信息（余额等）
 */
const getWallet = async (req, res, next) => {
  try {
    const userId = req.userId;
    let wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: 0 });
      logger.info(`为用户 ${userId} 自动创建钱包`);
    }
    res.json({
      code: 200,
      data: {
        id: wallet.id,
        userId: wallet.userId,
        balance: wallet.balance,
        frozenAmount: wallet.frozenAmount || 0
      }
    });
  } catch (error) {
    logger.error('获取钱包信息错误:', error);
    next(error);
  }
};

/**
 * 获取当前用户的交易记录
 */
const getTransactions = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page = 1, pageSize = 20 } = req.query;

    const { count, rows } = await Transaction.findAndCountAll({
      where: {
        [Op.or]: [                    // 现在 Op 已正确定义
          { fromUserId: userId },
          { toUserId: userId }
        ]
      },
      include: [
        { model: User, as: 'fromUser', attributes: ['id', 'username'] },
        { model: User, as: 'toUser', attributes: ['id', 'username'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(pageSize),
      offset: (parseInt(page) - 1) * parseInt(pageSize)
    });

    const list = rows.map(tx => ({
      id: tx.id,
      fromUserId: tx.fromUserId,
      toUserId: tx.toUserId,
      fromUserName: tx.fromUser?.username || '',
      toUserName: tx.toUser?.username || '',
      amount: tx.amount,
      type: tx.type,
      status: tx.status,
      createdAt: tx.createdAt,
      direction: tx.fromUserId === userId ? 'out' : 'in'
    }));

    res.json({
      code: 200,
      data: { list, total: count, page: parseInt(page), pageSize: parseInt(pageSize) }
    });
  } catch (error) {
    logger.error('获取交易记录错误:', error);
    next(error);
  }
};

module.exports = { getWallet, getTransactions };