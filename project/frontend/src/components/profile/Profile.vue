<template>
  <div class="profile">
    <el-card>
      <template #header><span>个人中心</span></template>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="userInfo.status === 'active' ? 'success' : 'danger'">
            {{ userInfo.status === 'active' ? '正常' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <el-divider />

      <!-- ✅ 管理员专属入口：进入后台 -->
      <el-button
        v-if="isAdmin"
        type="primary"
        size="large"
        @click="$router.push('/admin/dashboard')"
        style="width: 100%; margin-top: 16px;"
      >
        进入后台
      </el-button>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/store/userStore'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo || {})
const isAdmin = computed(() => userInfo.value.username === 'admin')

onMounted(() => {
  if (!userInfo.value.id) {
    userStore.fetchUserInfo()
  }
})
</script>