<template>
  <div class="seat-booking">
    <!-- 右上角跳转“我的预约” -->
    <div style="margin-bottom: 16px; display: flex; justify-content: flex-end;">
      <el-button type="warning" @click="$router.push('/library/my')">我的预约</el-button>
    </div>

    <el-select v-model="floor" @change="fetchSeats" placeholder="选择楼层">
      <el-option v-for="f in 3" :key="f" :label="f + '楼'" :value="f" />
    </el-select>

    <el-table :data="seats" v-loading="loading" style="margin-top: 16px;">
      <el-table-column prop="seatNo" label="座位号" />
      <el-table-column prop="area" label="区域" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openBookDialog(row)">预约</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 预约对话框 -->
    <el-dialog v-model="dialogVisible" title="预约座位" width="400px">
      <el-form :model="bookingForm" label-width="100px">
        <el-form-item label="日期">
          <el-date-picker v-model="bookingForm.date" type="date" placeholder="选择日期" :disabled-date="disabledDate" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-time-select v-model="bookingForm.startTime" :max-time="'21:00'" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="使用时长">
          <el-select v-model="bookingForm.duration" placeholder="选择时长">
            <el-option v-for="h in 8" :key="h" :label="h + '小时'" :value="h" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBook">确认预约</el-button>
      </template>
    </el-dialog>

    <!-- 二维码弹窗 -->
    <el-dialog v-model="qrVisible" title="预约成功" width="350px" center>
      <div style="text-align: center">
        <qrcode-vue v-if="qrCodeUrl" :value="qrCodeUrl" :size="200" level="H" />
        <p style="margin-top: 16px; color: #999;">请向管理员出示此二维码完成签到</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import * as libraryAPI from '@/api/library'
import QrcodeVue from 'vue-qrcode'

const floor = ref(1)
const seats = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const qrVisible = ref(false)
const qrCodeUrl = ref('')
const currentSeat = ref(null)

const bookingForm = ref({
  date: '',
  startTime: '',
  duration: 1
})

const disabledDate = (time) => {
  const today = new Date()
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  return time.getTime() < tomorrow.getTime() || time.getTime() > new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate() + 1).getTime()
}

const fetchSeats = async () => {
  loading.value = true
  try {
    const res = await libraryAPI.getLibrarySeats({ floor: floor.value })
    if (res.code === 200) {
      seats.value = res.data || []
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const openBookDialog = (seat) => {
  currentSeat.value = seat
  dialogVisible.value = true
}

const handleBook = async () => {
  const { date, startTime, duration } = bookingForm.value
  if (!date || !startTime) {
    ElMessage.warning('请完善预约信息')
    return
  }

  const endTime = new Date(new Date(date).setHours(parseInt(startTime) + duration)).toTimeString().slice(0, 5)
  try {
    const res = await libraryAPI.bookSeat({
      seatId: currentSeat.value.id,
      date: new Date(date).toISOString().slice(0, 10),
      startTime,
      endTime
    })

    if (res.code === 200) {
      dialogVisible.value = false
      qrCodeUrl.value = `http://192.168.0.199:8080/admin/library/verify?token=${res.data.qrToken}`
      qrVisible.value = true
      ElMessage.success('预约成功')
    } else {
      ElMessage.error(res.msg)
    }
  } catch (error) {
    ElMessage.error('预约失败')
  }
}

onMounted(fetchSeats)
</script>