<template>
  <div class="order-publish">
    <el-card>
      <template #header>
        <h3>发布代取订单</h3>
      </template>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="取件码" prop="pickupCode">
          <el-input
            v-model="form.pickupCode"
            placeholder="请输入取件码"
            maxlength="20"
            @input="form.pickupCode = form.pickupCode.replace(/\s/g, '')"
          />
        </el-form-item>
        
        <el-form-item label="快递站地址" prop="pickupAddress">
          <el-input
            v-model="form.pickupAddress"
            placeholder="请输入快递站具体地址"
            maxlength="200"
          />
        </el-form-item>
        
        <el-form-item label="送达地址" prop="deliveryAddress">
          <el-input
            v-model="form.deliveryAddress"
            placeholder="请输入期望送达的具体地点"
            maxlength="200"
          />
        </el-form-item>
        
        <el-form-item label="报酬金额" prop="amount">
          <el-input-number
            v-model="form.amount"
            :min="0.1"
            :max="50"
            :precision="2"
            :step="0.5"
            controls-position="right"
          />
          <span class="unit">元</span>
        </el-form-item>
        
        <el-form-item label="截止接单时间" prop="deadline">
          <el-date-picker
            v-model="form.deadline"
            type="datetime"
            placeholder="选择截止时间"
            :disabled-date="disabledDate"
            :default-time="defaultTime"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
          <div class="hint">截止时间至少需晚于当前时间30分钟</div>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            发布订单
          </el-button>
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
import { publishOrder } from '@/api/order'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  pickupCode: '',
  pickupAddress: '',
  deliveryAddress: '',
  amount: 5,
  deadline: ''
})

const rules = {
  pickupCode: [
    { required: true, message: '请输入取件码', trigger: 'blur' }
  ],
  pickupAddress: [
    { required: true, message: '请输入快递站地址', trigger: 'blur' }
  ],
  deliveryAddress: [
    { required: true, message: '请输入送达地址', trigger: 'blur' }
  ],
  amount: [
    { required: true, message: '请输入报酬金额', trigger: 'blur' }
  ],
  deadline: [
    { required: true, message: '请选择截止时间', trigger: 'change' }
  ]
}

const disabledDate = (time) => {
  const minTime = Date.now() + 30 * 60 * 1000
  return time.getTime() < minTime
}

const defaultTime = new Date(Date.now() + 60 * 60 * 1000)

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    loading.value = true
    try {
      await publishOrder(form)
      ElMessage.success('订单发布成功')
      router.push('/order/list')
    } catch (error) {
      ElMessage.error(error.message || '发布失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.order-publish {
  max-width: 600px;
  margin: 0 auto;
  
  .unit {
    margin-left: 8px;
    color: #666;
  }
  
  .hint {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
}
</style>