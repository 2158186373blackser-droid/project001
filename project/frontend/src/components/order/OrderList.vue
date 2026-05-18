<template>
  <div class="order-list">
    <el-tabs v-model="activeTab" @tab-click="fetchOrders">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane label="待接单" name="pending" />
      <el-tab-pane label="已接单" name="accepted" />
      <el-tab-pane label="已完成" name="completed" />
    </el-tabs>

    <el-table :data="orders" v-loading="loading" empty-text="暂无订单">
      <el-table-column prop="orderNo" label="订单号" />
      <el-table-column prop="pickupAddress" label="取件地址" />
      <el-table-column prop="deliveryAddress" label="送达地址" />
      <el-table-column prop="amount" label="报酬" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="router.push(`/order/${row.id}`)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOrderList } from '@/api/order'

const router = useRouter()
const loading = ref(false)
const orders = ref([])         // 必须初始化为空数组
const activeTab = ref('all')

const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await getOrderList({ status: activeTab.value === 'all' ? '' : activeTab.value })
    // 后端返回 { code: 200, data: { list: [...], total } }
    if (res.code === 200 && res.data) {
      orders.value = res.data.list || []   // 确保是数组
    } else {
      orders.value = []
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    orders.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)
</script>