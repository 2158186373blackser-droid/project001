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

        <el-menu-item v-if="isAdmin" index="/admin/dashboard">管理后台</el-menu-item>

        <div class="flex-grow" />

        <el-menu-item index="/admin/messages">
          <el-badge :is-dot="hasUnread" class="item">
            <el-icon><Bell /></el-icon>
          </el-badge>
        </el-menu-item>

        <el-sub-menu index="/profile" popper-class="profile-menu">
          <template #title>
            <el-icon><User /></el-icon>
          </template>
          <el-menu-item index="/profile">个人中心</el-menu-item>
          <el-menu-item index="/wallet">钱包</el-menu-item>
          <el-menu-item index="do-not-route" @click.capture.stop.prevent="handleLogout">
            <div style="width: 100%; height: 100%;">退出登录</div>
          </el-menu-item>
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
import { User, Bell } from '@element-plus/icons-vue' // 新增：引入 Bell 图标
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/userStore'
import { computed, ref } from 'vue' // 新增：引入 ref

const route = useRoute()
const userStore = useUserStore()
const isAdmin = computed(() => userStore.userInfo?.username === 'admin')

// 状态：用于控制消息角标显示。实际业务中可改为通过 API 获取未读数
const hasUnread = ref(true) 

const handleLogout = async (e) => {
  if (e) {
    e.stopPropagation()
    e.preventDefault()
  }
  try {
    await ElMessageBox.confirm('确定退出登录吗？', '提示', { type: 'warning' })
    await userStore.logout()
  } catch (error) {
    console.log('已取消退出登录')
  }
}
</script>

<style scoped>
.main-layout { height: 100vh; display: flex; flex-direction: column; }
.el-header { padding: 0; }
.top-menu { width: 100%; display: flex; }
.flex-grow { flex-grow: 1; }
/* 给小铃铛增加一点样式间距 */
.item { margin-top: 5px; }
</style>