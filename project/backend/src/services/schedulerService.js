const { sequelize } = require('../config/database');
const { Booking, LibrarySeat, UserCredit } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

let isProcessing = false; // 防锁标识，一分钟一次如果不加这个非常容易卡死

const processExpiredBookings = async () => {
  if (isProcessing) return; 
  isProcessing = true;
  try {
    const now = new Date();
    // 仅查询需要处理的数据
    const expiredBookings = await Booking.findAll({
      where: { status: 'booked', date: { [Op.lte]: now } }
    });
    
    for (const booking of expiredBookings) {
      const bDate = new Date(`${booking.date} ${booking.startTime}`);
      // 超过15分钟未签到
      if (now > new Date(bDate.getTime() + 15 * 60 * 1000)) {
        await sequelize.transaction(async (t) => {
          booking.status = 'cancelled';
          booking.cancelReason = 'timeout';
          await booking.save({ transaction: t });
          await LibrarySeat.update({ status: 'available' }, { where: { id: booking.seatId }, transaction: t });
          
          const [userCredit] = await UserCredit.findOrCreate({
            where: { userId: booking.userId }, defaults: { absentCount: 0 }, transaction: t
          });
          userCredit.absentCount += 1;
          if (userCredit.absentCount >= 3) {
            userCredit.bannedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          }
          await userCredit.save({ transaction: t });
        });
      }
    }
  } catch (e) { logger.error('定时任务异常:', e); }
  finally { isProcessing = false; }
};

const processUnbanUsers = async () => {
  try {
    const now = new Date();
    const bannedUsers = await UserCredit.findAll({
      where: { bannedUntil: { [Op.lte]: now, [Op.ne]: null } }
    });
    
    for (const credit of bannedUsers) {
      credit.bannedUntil = null;
      credit.absentCount = 0;
      await credit.save();
    }
  } catch (error) { logger.error('解封任务异常:', error); }
};

const startScheduler = () => {
  // 修改：改回 1 分钟 (60 * 1000 毫秒)
  setInterval(async () => {
    await processExpiredBookings();
    await processUnbanUsers();
  }, 60 * 1000); 
  
  logger.info('✅ 定时任务已启动（频率：1分钟）');
};

module.exports = { startScheduler, processExpiredBookings, processUnbanUsers };