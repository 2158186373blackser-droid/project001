<template>
  <div class="wallet">
    <el-card>
      <template #header><span>我的钱包</span></template>
      <div class="balance-card">
        <div class="balance-label">可用余额</div>
        <div class="balance-value">¥{{ userStore.balance }}</div>
      </div>
      <el-divider />
      <h4>交易记录</h4>
      <el-table :data="transactions" v-loading="loading" empty-text="暂无交易记录">
        <el-table-column prop="type" label="类型">
          <template #default="{ row }">
            <el-tag :type="row.direction === 'out' ? 'danger' : 'success'">
              {{ row.direction === 'out' ? '付款' : '收款' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额">
          <template #default="{ row }">¥{{ row.amount }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="时间">
          <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { getTransactions } from '@/api/wallet'
import { useUserStore } from '@/store/userStore'
import dayjs from 'dayjs'

const userStore = useUserStore()
const loading = ref(false)
const transactions = ref([])   // 确保是数组

const formatTime = (t) => dayjs(t).format('YYYY-MM-DD HH:mm')

const fetchData = async () => {
  loading.value = true
  try {
    // 1. 强制刷新余额
    await userStore.fetchBalance()
    // 2. 获取交易记录
    const res = await getTransactions()
    // 后端返回 { code: 200, data: { list: [...], total, ... } }
    if (res.code === 200 && res.data) {
      transactions.value = res.data.list || []   // 取 list 数组
    } else {
      transactions.value = []
    }
  } catch (error) {
    console.error('获取交易记录失败:', error)
    transactions.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
onActivated(fetchData)   // 如果使用了 keep-alive，确保切换回来时刷新
</script>

<style scoped>
.balance-card { text-align: center; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: #fff; }
.balance-label { font-size: 14px; opacity: 0.9; }
.balance-value { font-size: 48px; font-weight: bold; margin-top: 8px; }
</style>