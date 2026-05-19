const { Message } = require('../models');

exports.getMessageList = async (req, res) => {
    try {
        const messages = await Message.findAll({ where: { user_id: req.user.id } });
        res.json({ code: 200, data: messages });
    } catch (e) {
        res.status(500).json({ code: 500, message: '获取消息失败' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Message.update({ is_read: 1 }, { where: { id: req.params.id } });
        res.json({ code: 200, message: 'success' });
    } catch (e) {
        res.status(500).json({ code: 500, message: '操作失败' });
    }
};