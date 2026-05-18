<template>
  <div class="goods-publish">
    <el-card>
      <template #header><h3>发布商品</h3></template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" maxlength="50" show-word-limit placeholder="请输入商品标题" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option label="书籍资料" value="books" />
            <el-option label="电子产品" value="electronics" />
            <el-option label="生活用品" value="daily" />
            <el-option label="服装鞋帽" value="clothing" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0.01" :max="9999" :precision="2" controls-position="right" />
          <span class="unit">元</span>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" maxlength="1000" show-word-limit />
        </el-form-item>
        <el-form-item label="图片" prop="images">
          <el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="9" :on-change="handleImageChange">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">发布</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { publishGoods } from '@/api/goods'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const form = reactive({ title: '', category: '', price: 10, description: '', images: [] })

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
}

const handleImageChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => { form.images.push(e.target.result) }
  reader.readAsDataURL(file.raw)
}

const handleSubmit = async () => {
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      await publishGoods(form)
      ElMessage.success('发布成功')
      router.push('/market/list')
    } catch (error) {
      ElMessage.error(error.message || '发布失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.goods-publish { max-width: 600px; margin: 0 auto; }
.unit { margin-left: 8px; color: #666; }
</style>