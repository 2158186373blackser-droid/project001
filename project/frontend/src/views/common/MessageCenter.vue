<template>
  <div class="message-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>我的消息通知</span>
          <el-button type="primary" size="small" @click="fetchMessages">刷新列表</el-button>
        </div>
      </template>

      <el-table :data="messageList" v-loading="loading" style="width: 100%">
        <el-table-column prop="content" label="消息内容" min-width="300" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="createTime" label="时间" width="180" />
        
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.isRead === 1 ? 'info' : 'danger'">
              {{ row.isRead === 1 ? '已读' : '未读' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button 
              v-if="row.isRead === 0" 
              link 
              type="primary" 
              @click="handleRead(row.id)">
              标记已读
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMessages, markRead } from '@/api/common/message'; // 导入 API
import { ElMessage } from 'element-plus';

// 响应式变量：存储消息列表和加载状态
const loading = ref(false);
const messageList = ref([]);

// 1. 获取消息数据的函数
const fetchMessages = async () => {
  loading.value = true;
  try {
    // 调用 API 获取数据
    const res = await getMessages();
    // 假设后端返回的数据在 res.data 中
    messageList.value = res.data || [];
  } catch (error) {
    ElMessage.error('获取消息失败，请检查后端服务');
  } finally {
    loading.value = false;
  }
};

// 2. 标记已读的函数
const handleRead = async (id) => {
  try {
    await markRead(id);
    ElMessage.success('已标记为已读');
    fetchMessages(); // 标记成功后，重新加载列表
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

// 页面加载时自动获取数据
onMounted(fetchMessages);
</script>

<style scoped>
.message-container { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>