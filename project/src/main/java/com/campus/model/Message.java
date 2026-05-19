package com.campus.model;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 站内消息实体类
 * 对应数据库表 t_message
 */
@Data
public class Message {
    private Long id;              // 消息ID
    private Long userId;          // 接收消息的用户ID
    private String type;          // 消息类型 (例如: ORDER, SYSTEM, POST)
    private String content;       // 消息内容
    private Long refId;           // 关联业务ID (如订单ID，方便跳转)
    private Integer isRead;       // 0: 未读, 1: 已读
    private LocalDateTime createTime; // 消息创建时间
    private LocalDateTime expireTime; // 消息过期时间 (90天后清理)
}