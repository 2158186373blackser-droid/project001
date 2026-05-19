import request from '@/utils/request';

/**
 * 消息通知模块 API
 */

// 获取当前用户的消息列表
export function getMessages() {
  return request({
    url: '/api/messages',
    method: 'get'
  });
}

// 标记单条消息为已读
export function markRead(id) {
  return request({
    url: `/api/messages/${id}/read`,
    method: 'put'
  });
}