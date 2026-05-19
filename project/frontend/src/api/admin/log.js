import request from '@/utils/request';

/**
 * 获取操作日志列表
 * @param {Object} params - 分页参数 { page, pageSize }
 */
export const getAdminLogs = (params) => {
  return request({
    url: '/admin/logs',
    method: 'get',
    params
  });
};