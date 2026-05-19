// 修改 src/api/common/message.js
import request from '@/utils/request';

export function getMessages() {
  return request({
    url: '/messages', // 只需要写接口的相对路径，不要带 /api
    method: 'get'
  });
}

export function markRead(id) {
  return request({
    url: `/messages/${id}/read`, // 同上
    method: 'put'
  });
}