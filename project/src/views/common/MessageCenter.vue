<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>我的消息</span>
        <el-button size="small" @click="fetchData">刷新</el-button>
      </div>
    </template>
    
    <el-table :data="messageList" v-loading="loading" style="width: 100%">
      <el-table-column prop="content" label="通知内容" min-width="300" />
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
          <el-button v-if="row.isRead === 0" link type="primary" @click="handleRead(row)">标记已读</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMessages, markRead } from '@/api/common/message';
import { ElMessage } from 'element-plus';

const loading = ref(false);
const messageList = ref([]);

const fetchData = async () => {
  loading.value = true;
  try {
    // 适配后端直接返回数组的结构
    const res = await getMessages();
    messageList.value = res.data || []; 
  } catch (error) {
    ElMessage.error('获取消息失败');
  } finally {
    loading.value = false;
  }
};

const handleRead = async (row) => {
  await markRead(row.id);
  ElMessage.success('已标记为已读');
  fetchData(); // 重新加载数据
};

onMounted(fetchData);
</script>