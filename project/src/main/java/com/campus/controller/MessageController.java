package com.campus.controller;

import com.campus.model.Message;
import com.campus.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    @Autowired
    private MessageService messageService;

    /**
     * 获取当前用户的消息列表
     * @param userId 从认证Token或Header中解析出的用户ID
     */
    @GetMapping
    public List<Message> getMessageList(@RequestHeader("UserId") Long userId) {
        // 这里返回列表数据，前端直接接收数组
        return messageService.getUserMessages(userId);
    }

    /**
     * 标记消息为已读
     */
    @PutMapping("/{id}/read")
    public String markRead(@PathVariable Long id) {
        messageService.markAsRead(id);
        return "success";
    }
}