<template>
  <div class="verify-container">
    <el-card>
      <template #header><span>图书馆核销</span></template>
      <el-input
        v-model="token"
        placeholder="请输入或扫描二维码自动填充"
        style="margin-bottom: 16px;"
        clearable
      />
      <el-button type="primary" @click="handleVerify" :loading="loading">核销签到</el-button>
      <el-divider />
      <p class="tip">请用户出示预约成功后的二维码，扫码后自动填入上方输入框</p>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminVerifyQRCode } from '@/api/admin/library'

const route = useRoute()
const token = ref('')
const loading = ref(false)

onMounted(() => {
  const qToken = route.query.token
  if (qToken) {
    token.value = qToken
  }
})

const handleVerify = async () => {
  if (!token.value) {
    ElMessage.warning('请输入核销令牌')
    return
  }
  loading.value = true
  try {
    const res = await adminVerifyQRCode({ token: token.value })
    if (res.code === 200) {
      ElMessage.success('核销成功')
      token.value = ''
    } else {
      ElMessage.error(res.msg || '核销失败')
    }
  } catch (error) {
    ElMessage.error('核销失败，请检查网络')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.tip { color: #999; font-size: 14px; }
</style>