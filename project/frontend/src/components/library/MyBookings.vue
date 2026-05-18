<template>
  <div class="my-bookings">
    <el-card>
      <template #header><span>我的预约</span></template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="已预约" name="booked" />
        <el-tab-pane label="已签到" name="checked_in" />
        <el-tab-pane label="已取消" name="cancelled" />
        <el-tab-pane label="爽约" name="absent" />
      </el-tabs>

      <el-table :data="filteredBookings" v-loading="loading" empty-text="暂无预约记录">
        <el-table-column label="座位号">
          <template #default="{ row }">{{ row.LibrarySeat?.seatNo || '未知' }}</template>
        </el-table-column>
        <el-table-column label="区域">
          <template #default="{ row }">{{ row.LibrarySeat?.area || '' }}</template>
        </el-table-column>
        <el-table-column label="楼层">
          <template #default="{ row }">{{ row.LibrarySeat?.floor || '' }}</template>
        </el-table-column>
        <el-table-column prop="date" label="日期" />
        <el-table-column label="时间">
          <template #default="{ row }">{{ row.startTime?.slice(11,16) }} ~ {{ row.endTime?.slice(11,16) }}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'booked'"
              type="danger"
              size="small"
              @click="handleCancel(row.id)"
            >
              取消预约
            </el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMyBookings, cancelBooking } from '@/api/library'

const loading = ref(false)
const bookings = ref([])
const activeTab = ref('all')

const filteredBookings = computed(() => {
  if (activeTab.value === 'all') return bookings.value
  return bookings.value.filter(item => item.status === activeTab.value)
})

const fetchBookings = async () => {
  loading.value = true
  try {
    const res = await getMyBookings()
    if (res.code === 200) {
      bookings.value = res.data || []
    }
  } catch (e) {
    ElMessage.error('网络错误')
  } finally {
    loading.value = false
  }
}

const handleCancel = async (id) => {
  try {
    await ElMessageBox.confirm('确定取消该预约吗？', '提示', { type: 'warning' })
    const res = await cancelBooking(id)
    if (res.code === 200) {
      ElMessage.success('已取消')
      await fetchBookings()
    } else {
      ElMessage.error(res.msg || '取消失败')
    }
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('操作失败')
  }
}

const statusText = (status) => ({
  booked: '已预约',
  checked_in: '已签到',
  cancelled: '已取消',
  absent: '爽约'
}[status] || status)

const statusType = (status) => ({
  booked: 'primary',
  checked_in: 'success',
  cancelled: 'info',
  absent: 'danger'
}[status] || 'info')

onMounted(fetchBookings)
</script>