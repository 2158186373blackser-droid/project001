<template>
  <div class="home">
    <!-- 轮播图 - 学校风景照 -->
    <el-carousel :interval="5000" arrow="always" height="350px" class="banner">
      <el-carousel-item v-for="(img, index) in schoolImages" :key="index">
        <div class="banner-item" :style="{ backgroundImage: `url(${img.url})` }">
          <div class="banner-overlay">
            <h2>{{ img.title }}</h2>
            <p>{{ img.desc }}</p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    
    <!-- 新闻列表 -->
    <el-row :gutter="20" class="news-section">
      <el-col :span="16">
        <el-card class="news-card">
          <template #header>
            <div class="card-header">
              <span><el-icon><Bell /></el-icon> 校园资讯</span>
              <el-link type="primary">更多</el-link>
            </div>
          </template>
          <div class="news-list">
            <div
              v-for="news in newsList"
              :key="news.id"
              class="news-item"
            >
              <span class="news-tag" :class="news.category">{{ getCategoryText(news.category) }}</span>
              <span class="news-title">{{ news.title }}</span>
              <span class="news-time">{{ formatTime(news.publishedAt) }}</span>
            </div>
            <el-empty v-if="newsList.length === 0" description="暂无新闻" />
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="stats-card">
          <template #header>
            <span><el-icon><DataAnalysis /></el-icon> 平台数据</span>
          </template>
          <div class="stats-list" v-loading="statsLoading">
            <div class="stat-item">
              <span class="stat-label">总订单数</span>
              <span class="stat-value">{{ stats.totalOrders }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">在线商品</span>
              <span class="stat-value">{{ stats.onlineGoods }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">可用座位</span>
              <span class="stat-value">{{ stats.availableSeats }}</span>
            </div>
          </div>
        </el-card>
        
        <el-card class="notice-card" style="margin-top: 20px">
          <template #header>
            <span><el-icon><InfoFilled /></el-icon> 系统通知</span>
          </template>
          <div class="notice-list">
            <div class="notice-item">
              <p>📢 新用户注册即送10元余额</p>
            </div>
            <div class="notice-item">
              <p>🎉 五一假期服务正常运营</p>
            </div>
            <div class="notice-item">
              <p>💡 记得及时确认收货哦</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Bell, DataAnalysis, InfoFilled } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { getNewsList } from '@/api/news'
import { getOrderList } from '@/api/order'
import { getGoodsList } from '@/api/goods'
import { getSeats } from '@/api/library'

// 学校风景照（景德镇艺术职业大学）
const schoolImages = ref([
  {
    url: 'https://picsum.photos/1200/400?random=1',
    title: '景德镇艺术职业大学',
    desc: '艺术与科技的摇篮'
  },
  {
    url: 'https://picsum.photos/1200/400?random=2',
    title: '图书馆',
    desc: '知识的海洋，学习的圣地'
  },
  {
    url: 'https://picsum.photos/1200/400?random=3',
    title: '教学楼',
    desc: '现代化的教学设施'
  },
  {
    url: 'https://picsum.photos/1200/400?random=4',
    title: '校园风光',
    desc: '美丽的校园环境'
  }
])

// 新闻数据
const newsList = ref([
  {
    id: 1,
    title: '人民日报：让青春在奉献中焕发绚丽光彩',
    category: 'announcement',
    publishedAt: '2026-04-18 08:30:00'
  },
  {
    id: 2,
    title: '我校在江西省大学生艺术展演中荣获多项大奖',
    category: 'activity',
    publishedAt: '2026-04-17 14:20:00'
  },
  {
    id: 3,
    title: '关于五一劳动节期间图书馆开放安排的通知',
    category: 'notice',
    publishedAt: '2026-04-16 10:00:00'
  },
  {
    id: 4,
    title: '陶瓷艺术设计专业毕业作品展即将开幕',
    category: 'activity',
    publishedAt: '2026-04-15 16:45:00'
  },
  {
    id: 5,
    title: '校园一卡通系统升级通知',
    category: 'notice',
    publishedAt: '2026-04-14 09:15:00'
  },
  {
    id: 6,
    title: '关于举办校园招聘会的通知',
    category: 'announcement',
    publishedAt: '2026-04-13 11:30:00'
  }
])

// 统计数据
const stats = ref({
  totalOrders: 0,
  onlineGoods: 0,
  availableSeats: 0
})
const statsLoading = ref(false)

const getCategoryText = (category) => {
  const map = { announcement: '公告', activity: '活动', notice: '通知' }
  return map[category] || category
}

const formatTime = (time) => {
  return dayjs(time).format('MM-DD HH:mm')
}

// 获取真实统计数据
const fetchStats = async () => {
  statsLoading.value = true
  try {
    // 并行请求获取真实数据
    const [orderRes, goodsRes, seatsRes] = await Promise.allSettled([
      getOrderList({ page: 1, pageSize: 1 }),
      getGoodsList({ page: 1, pageSize: 1 }),
      getSeats({ page: 1, pageSize: 1 })
    ])
    
    stats.value.totalOrders = orderRes.status === 'fulfilled' ? orderRes.value.data?.total || 0 : 0
    stats.value.onlineGoods = goodsRes.status === 'fulfilled' ? goodsRes.value.data?.total || 0 : 0
    stats.value.availableSeats = seatsRes.status === 'fulfilled' ? seatsRes.value.data?.total || 0 : 0
  } catch (error) {
    console.warn('获取统计数据失败，使用默认值')
  } finally {
    statsLoading.value = false
  }
}

// 获取新闻
const fetchNews = async () => {
  try {
    const res = await getNewsList({ page: 1, pageSize: 6 })
    if (res.data?.list?.length > 0) {
      newsList.value = res.data.list
    }
  } catch (error) {
    console.warn('获取新闻失败，使用本地数据')
  }
}

onMounted(() => {
  fetchStats()
  fetchNews()
})
</script>

<style lang="scss" scoped>
.home {
  .banner {
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    .banner-item {
      height: 100%;
      background-size: cover;
      background-position: center;
      position: relative;
      
      .banner-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 40px 60px;
        background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        color: #fff;
        
        h2 {
          font-size: 32px;
          margin-bottom: 8px;
        }
        
        p {
          font-size: 16px;
          opacity: 0.9;
        }
      }
    }
  }
  
  .news-section {
    .news-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .news-list {
        min-height: 300px;
        
        .news-item {
          display: flex;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          
          &:hover {
            background: #f5f7fa;
          }
          
          .news-tag {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            margin-right: 12px;
            
            &.announcement { background: #e6f7ff; color: #1890ff; }
            &.activity { background: #f6ffed; color: #52c41a; }
            &.notice { background: #fff7e6; color: #faad14; }
          }
          
          .news-title {
            flex: 1;
            color: #333;
          }
          
          .news-time {
            color: #999;
            font-size: 12px;
          }
        }
      }
    }
    
    .stats-card, .notice-card {
      .stats-list {
        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid #f0f0f0;
          
          &:last-child {
            border-bottom: none;
          }
          
          .stat-label {
            color: #666;
          }
          
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #409eff;
          }
        }
      }
      
      .notice-list {
        .notice-item {
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
          
          &:last-child {
            border-bottom: none;
          }
          
          p {
            margin: 0;
            color: #666;
          }
        }
      }
    }
  }
}
</style>