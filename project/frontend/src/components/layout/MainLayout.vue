<template>
  <el-container class="main-layout">
    <el-header>
      <el-menu
        :default-active="route.path"
        mode="horizontal"
        router
        class="top-menu"
        :ellipsis="false"
      >
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item index="/order/list">代取快递</el-menu-item>
        <el-menu-item index="/market/list">二手市场</el-menu-item>
        <el-menu-item index="/forum/list">论坛</el-menu-item>
        <el-menu-item index="/library/booking">图书馆预约</el-menu-item>

        <!-- 管理后台入口：仅管理员可见，普通用户完全看不到 -->
        <el-menu-item v-if="isAdmin" index="/admin/dashboard">管理后台</el-menu-item>

        <div class="flex-grow" />

        <!-- 个人中心下拉菜单 -->
        <el-sub-menu index="/profile" popper-class="profile-menu">
          <template #title>
            <el-icon><User /></el-icon>
          </template>
          <el-menu-item index="/profile">个人中心</el-menu-item>
          <el-menu-item index="/wallet">钱包</el-menu-item>
          <el-menu-item index="logout" @click.prevent="handleLogout">退出登录</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-header>

    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { User, Wallet, SwitchButton } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/userStore'
import { computed } from 'vue'

const route = useRoute()
const userStore = useUserStore()
const isAdmin = computed(() => userStore.userInfo?.username === 'admin')

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定退出登录吗？', '提示', { type: 'warning' })
    await userStore.logout()
  } catch (e) {}
}
</script>

<style scoped>
.main-layout { height: 100vh; display: flex; flex-direction: column; }
.el-header { padding: 0; }
.top-menu { width: 100%; display: flex; }
.flex-grow { flex-grow: 1; }
</style>