import request from '@/utils/request'; // 只保留这一行

export const getUserList = (params) => request({ 
  url: '/admin/users', 
  method: 'get', 
  params 
});

export const banUser = (id, data) => request({ 
  url: `/admin/users/${id}/ban`, 
  method: 'post', 
  data 
});

export const unbanUser = (id) => request({ 
  url: `/admin/users/${id}/unban`, 
  method: 'post' 
});

// 新增：重置爽约次数接口
export const resetUserAbsence = (id) => request({ 
  url: `/admin/users/${id}/reset-absence`, 
  method: 'post' 
});