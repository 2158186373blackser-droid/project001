import request from '@/utils/request'

/**
 * 获取钱包信息（余额）
 * @param {Object} params - 额外参数（可选，用于缓存破坏）
 */
export const getWallet = (params = {}) =>
  request({
    url: '/wallet',
    method: 'get',
    params: { _t: Date.now(), ...params }   // _t 时间戳破坏缓存
  })

/**
 * 获取交易记录
 * @param {Object} params - 额外参数（可选）
 */
export const getTransactions = (params = {}) =>
  request({
    url: '/wallet/transactions',
    method: 'get',
    params: { _t: Date.now(), ...params }
  })