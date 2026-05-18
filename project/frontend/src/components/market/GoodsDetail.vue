<template>
  <div class="goods-detail">
    <el-card v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="10">
          <el-carousel height="300px">
            <el-carousel-item v-for="(img, i) in goods.images" :key="i">
              <el-image :src="img" fit="contain" style="width: 100%; height: 100%;" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="14">
          <h2>{{ goods.title }}</h2>
          <div class="price">¥{{ goods.price }}</div>
          <div class="info">
            <span>卖家：{{ goods.seller?.username }}</span>
            <span>浏览：{{ goods.viewCount }}</span>
          </div>
          <el-button type="danger" size="large" :disabled="goods.status !== 'active'" @click="handleBuy">立即购买</el-button>
        </el-col>
      </el-row>
      <el-divider />
      <div class="description">
        <h4>商品描述</h4>
        <p>{{ goods.description || '暂无描述' }}</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getGoodsDetail, buyGoods } from '@/api/goods'
import { useUserStore } from '@/store/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const goods = ref({})

const fetchGoods = async () => {
  loading.value = true
  try {
    const res = await getGoodsDetail(route.params.id)
    goods.value = res.data
  } catch (error) {
    ElMessage.error('获取商品详情失败')
  } finally {
    loading.value = false
  }
}

const handleBuy = async () => {
  await ElMessageBox.confirm(`确认购买 ${goods.value.title} ？`, '确认购买', { type: 'warning' })
  try {
    const res = await buyGoods(goods.value.id)
    if (res.code === 200) {
      // 购买成功，强制从服务器刷新余额
      await userStore.fetchBalance()
      ElMessage.success(`购买成功！当前余额 ¥${userStore.balance}`)
      router.push('/wallet')   // 跳转到钱包页面查看余额
    } else {
      ElMessage.error(res.msg || '购买失败')
    }
  } catch (error) {
    // 处理 axios 错误
    if (error?.response?.data?.msg) {
      ElMessage.error(error.response.data.msg)
    } else if (error !== 'cancel') {
      ElMessage.error('购买失败，请稍后重试')
    }
  }
}

onMounted(fetchGoods)
</script>

<style scoped>
.price { font-size: 28px; font-weight: bold; color: #f56c6c; margin: 16px 0; }
.info { display: flex; gap: 24px; color: #999; margin-bottom: 24px; }
.description { padding: 16px 0; }
.description h4 { margin-bottom: 12px; }
</style>