<template>
  <div class="post-list">
    <div style="margin-bottom: 16px;">
      <el-button type="primary" @click="router.push('/forum/publish')">发布帖子</el-button>
    </div>

    <el-table :data="posts" v-loading="loading" empty-text="暂无帖子">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="author.username" label="作者" />
      <el-table-column prop="createdAt" label="发布时间" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="router.push(`/forum/${row.id}`)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPostList } from '@/api/post'

const router = useRouter()
const loading = ref(false)
const posts = ref([])         

const fetchPosts = async () => {
  loading.value = true
  try {
    const res = await getPostList()
    // 关键修复：直接取被拦截器处理后的数组 res.data
    if (res.code === 200 && Array.isArray(res.data)) {
      posts.value = res.data
    } else {
      posts.value = []
    }
  } catch (error) {
    console.error('获取帖子列表失败:', error)
    posts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchPosts)
</script>