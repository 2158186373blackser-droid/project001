<template>
  <div class="goods-list">
    <div style="margin-bottom: 16px; display: flex; gap: 16px;">
      <el-input
        v-model="keyword"
        placeholder="搜索商品"
        clearable
        @input="fetchGoods"
        style="width: 300px;"
      />
      <el-button type="primary" @click="router.push('/market/publish')">发布商品</el-button>
    </div>

    <el-table
      v-if="Array.isArray(goods) && goods.length > 0"
      :data="goods"
      v-loading="loading"
      border
      empty-text="暂无商品"
    >
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="price" label="价格">
        <template #default="{ row }">¥{{ row.price }}</template>
      </el-table-column>
      <el-table-column prop="seller.username" label="卖家" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="router.push(`/market/${row.id}`)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!loading && goods.length === 0" description="暂无商品" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getGoodsList } from '@/api/goods'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const goods = ref([])   // ✅ 初始化为空数组
const keyword = ref('')

const fetchGoods = async () => {
  loading.value = true
  try {
    const res = await getGoodsList({
      keyword: keyword.value,
      page: 1,
      pageSize: 12
    })
    // 拦截器已将 data 转为数组，直接使用
    if (res && res.code === 200) {
      goods.value = res.data || []   // 确保始终是数组
    } else {
      goods.value = []
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    goods.value = []   // 出错时置空
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(fetchGoods)
</script>