<!-- eslint-disable -->
<template>
  <div class="time-selector">
    <div class="time-range">
      <el-time-select
        v-model="startTime"
        :max-time="endTime"
        placeholder="开始时间"
        start="08:00"
        step="00:30"
        end="22:00"
        @change="handleTimeChange"
      />
      <span class="separator">至</span>
      <el-time-select
        v-model="endTime"
        :min-time="startTime"
        placeholder="结束时间"
        start="08:00"
        step="00:30"
        end="22:00"
        :disabled="!startTime"
        @change="handleTimeChange"
      />
    </div>
    
    <div v-if="durationHours > 0" class="duration-info">
      <span>时长：{{ durationHours }}小时{{ durationMinutes }}分钟</span>
      <el-tag v-if="!isValidDuration" type="danger" size="small">时长需在1-8小时之间</el-tag>
      <el-tag v-else type="success" size="small">有效时长</el-tag>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ startTime: '', endTime: '' })
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const startTime = ref(props.modelValue.startTime || '')
const endTime = ref(props.modelValue.endTime || '')

const durationHours = computed(() => {
  if (!startTime.value || !endTime.value) return 0
  const start = new Date(`2000-01-01 ${startTime.value}`)
  const end = new Date(`2000-01-01 ${endTime.value}`)
  return Math.floor((end - start) / (1000 * 60 * 60))
})

const durationMinutes = computed(() => {
  if (!startTime.value || !endTime.value) return 0
  const start = new Date(`2000-01-01 ${startTime.value}`)
  const end = new Date(`2000-01-01 ${endTime.value}`)
  return Math.floor(((end - start) % (1000 * 60 * 60)) / (1000 * 60))
})

const isValidDuration = computed(() => {
  const hours = durationHours.value + durationMinutes.value / 60
  return hours >= 1 && hours <= 8
})

const handleTimeChange = () => {
  const value = { startTime: startTime.value, endTime: endTime.value }
  emit('update:modelValue', value)
  emit('change', { ...value, isValid: isValidDuration.value, hours: durationHours.value + durationMinutes.value / 60 })
}

watch(() => props.modelValue, (newVal) => {
  if (newVal.startTime !== startTime.value) startTime.value = newVal.startTime
  if (newVal.endTime !== endTime.value) endTime.value = newVal.endTime
}, { deep: true })
</script>

<style scoped>
.time-selector { padding: 10px 0; }
.time-range { display: flex; align-items: center; gap: 12px; }
.separator { color: #999; }
.duration-info { margin-top: 12px; display: flex; align-items: center; gap: 12px; }
</style>