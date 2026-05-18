<template>
  <el-container>
    <el-aside width="200px">
      <el-menu router>
        <el-menu-item index="/admin/dashboard">仪表盘</el-menu-item>
        <el-menu-item index="/admin/reports">举报管理</el-menu-item>
        <el-menu-item index="/admin/users">用户管理</el-menu-item>
        <el-menu-item index="/admin/logs">操作日志</el-menu-item>

        <!-- ✅ 管理员专属：图书馆核销 -->
        <el-menu-item v-if="isAdmin" index="/admin/library/verify">图书馆核销</el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/userStore'

const userStore = useUserStore()
const isAdmin = computed(() => userStore.userInfo?.username === 'admin')
</script>