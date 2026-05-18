import request from '@/utils/request'

// 管理员核销二维码
export const adminVerifyQRCode = (data) => request({
  url: '/admin/library/verify',
  method: 'post',
  data
})