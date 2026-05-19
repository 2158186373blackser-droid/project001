package com.campus.service;

import com.campus.model.Message;
import java.util.List;

public interface MessageService {
    // 获取指定用户的消息列表
    List<Message> getUserMessages(Long userId);
    
    // 标记单条消息为已读
    void markAsRead(Long messageId);
    
    // 自动清理过期消息 (用于定时任务)
    void deleteExpiredMessages(LocalDateTime limitTime);
}