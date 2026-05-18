<template>
  <div class="order-detail">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>订单详情 #{{ order.orderNo }}</span>
          <el-tag :type="getStatusType(order.status)">{{ getStatusText(order.status) }}</el-tag>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="取件码">
          <span class="pickup-code">{{ order.pickupCode }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="报酬金额">¥{{ order.amount }}</el-descriptions-item>
        <el-descriptions-item label="快递站地址" :span="2">{{ order.pickupAddress }}</el-descriptions-item>
        <el-descriptions-item label="送达地址" :span="2">{{ order.deliveryAddress }}</el-descriptions-item>
        <el-descriptions-item label="截止时间">{{ formatTime(order.deadline) }}</el-descriptions-item>
        <el-descriptions-item label="发布时间">{{ formatTime(order.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="发单人">{{ order.publisher?.username }}</el-descriptions-item>
        <el-descriptions-item label="接单人">{{ order.receiver?.username || '暂无' }}</el-descriptions-item>
      </el-descriptions>

      <div class="actions">
        <el-button v-if="order.status === 'accepted' && order.receiverId === userId" type="primary" @click="handlePickup">确认取件</el-button>
        <el-button v-if="order.status === 'picked' && order.receiverId === userId" type="primary" @click="handleDelivery">确认送达</el-button>
        <el-button v-if="order.status === 'delivered' && order.publisherId === userId" type="success" @click="handleComplete">确认收货</el-button>
        <el-button v-if="['delivered', 'picked', 'accepted'].includes(order.status)" type="warning" @click="handleComplaint">投诉</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderDetail, confirmPickup, confirmDelivery, confirmComplete, fileComplaint } from '@/api/order'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const order = ref({})
const userId = ref(parseInt(localStorage.getItem('userId') || '0'))

const getStatusType = (s) => ({ pending: 'warning', accepted: 'primary', picked: 'info', delivered: 'success', completed: 'success' }[s] || 'info')
const getStatusText = (s) => ({ pending: '待接单', accepted: '已接单', picked: '已取件', delivered: '待确认', completed: '已完成' }[s] || s)
const formatTime = (t) => t ? dayjs(t).format('YYYY-MM-DD HH:mm') : '-'

const goBack = () => router.back()

const fetchOrder = async () => {
  loading.value = true
  try {
    const res = await getOrderDetail(route.params.id)
    order.value = res.data
  } finally {
    loading.value = false
  }
}

const handlePickup = async () => {
  await ElMessageBox.confirm('确认已取到快递？', '确认取件', { type: 'warning' })
  await confirmPickup(order.value.id)
  ElMessage.success('确认取件成功')
  fetchOrder()
}

const handleDelivery = async () => {
  await ElMessageBox.confirm('确认已送达目的地？', '确认送达', { type: 'warning' })
  await confirmDelivery(order.value.id)
  ElMessage.success('确认送达成功')
  fetchOrder()
}

const handleComplete = async () => {
  await ElMessageBox.confirm('确认收货后资金将支付给接单人', '确认收货', { type: 'warning' })
  await confirmComplete(order.value.id)
  ElMessage.success('确认收货成功')
  fetchOrder()
}

const handleComplaint = async () => {
  const { value } = await ElMessageBox.prompt('请输入投诉原因', '投诉', { type: 'warning' })
  if (value) {
    await fileComplaint(order.value.id, value)
    ElMessage.success('投诉已提交')
    fetchOrder()
  }
}

onMounted(fetchOrder)
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.pickup-code { font-size: 24px; font-weight: bold; color: #409eff; }
.actions { margin-top: 20px; display: flex; gap: 12px; }
</style>