<template>
  <div class="post-list">
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
const posts = ref([])         // 初始化为空数组

const fetchPosts = async () => {
  loading.value = true
  try {
    const res = await getPostList()
    if (res.code === 200 && res.data) {
      posts.value = res.data.list || []
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