<template>
  <el-card>
    <template #header>操作日志记录</template>
    
    <div v-if="logs.length === 0" style="padding: 20px; color: #999;">
      暂无数据...
    </div>

    <el-table :data="logs" v-loading="loading" style="width: 100%" v-else>
      <el-table-column prop="id" label="ID" width="60" />
      
      <el-table-column label="操作员" width="120">
        <template #default="{ row }">
          {{ row.admin ? row.admin.username : (row.adminUsername || '系统') }}
        </template>
      </el-table-column>

      <el-table-column prop="operationType" label="操作" width="150" />
      <el-table-column prop="targetType" label="目标类型" width="120" />
      <el-table-column prop="ipAddress" label="IP" width="140" />
      <el-table-column prop="createdAt" label="时间" width="180" />
      
      <el-table-column label="详情">
        <template #default="{ row }">
          <el-popover placement="left" width="400" trigger="click">
            <template #reference><el-button size="small">查看</el-button></template>
            <div>
              <p><strong>修改前:</strong> {{ row.beforeSnapshot }}</p>
              <p><strong>修改后:</strong> {{ row.afterSnapshot }}</p>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAdminLogs } from '@/api/admin/log';

const loading = ref(false);
const logs = ref([]);

const fetchLogs = async () => {
  loading.value = true;
  try {
    const res = await getAdminLogs({ page: 1, pageSize: 20 });
    
    // 直接赋值逻辑
    if (res && Array.isArray(res.data)) {
      logs.value = res.data;
    } else {
      console.warn('API 返回的数据为空或格式异常:', res);
      logs.value = [];
    }
  } catch (error) {
    console.error('日志获取出错:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchLogs);
</script>