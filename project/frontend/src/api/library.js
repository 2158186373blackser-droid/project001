import request from '@/utils/request'

// 获取图书馆座位（支持楼层、日期筛选）
export const getLibrarySeats = (params) => request({
  url: '/library/seats',
  method: 'get',
  params
})

// 预约座位
export const bookSeat = (data) => request({
  url: '/library/book',
  method: 'post',
  data
})

// 签到
export const checkIn = (id) => request({
  url: `/library/checkin/${id}`,
  method: 'post'
})

// 取消预约
export const cancelBooking = (id) => request({
  url: `/library/cancel/${id}`,
  method: 'delete'
})

// 获取我的预约
export const getMyBookings = () => request({
  url: '/library/my',
  method: 'get'
})

// 获取信用信息
export const getCredit = () => request({
  url: '/library/credit',
  method: 'get'
})

// 提交申诉
export const submitAppeal = (data) => request({
  url: '/library/appeal',
  method: 'post',
  data
})