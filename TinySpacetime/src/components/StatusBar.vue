<template>
  <div class="status-bar">
    <div class="status-item">
      <span class="status-label">地点:</span>
      <span class="status-value">{{ location }}</span>
    </div>
    <div class="status-item">
      <span class="status-label">时间:</span>
      <span class="status-value">{{ time }}</span>
    </div>
    <div class="status-item">
      <span class="status-label">事件:</span>
      <span class="status-value">{{ event }}</span>
    </div>
    <div class="status-item">
      <span class="status-label">关系:</span>
      <span class="status-value">{{ relationshipsText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 定义props
const props = defineProps<{
  location: string;
  time: string;
  event: string;
  relationships: Record<string, string>;
}>();

// 计算关系文本
const relationshipsText = computed(() => {
  if (Object.keys(props.relationships).length === 0) {
    return '无';
  }
  return Object.entries(props.relationships)
    .map(([name, status]) => `${name}: ${status}`)
    .join(', ');
});

// 显式导出组件
defineOptions({
  name: 'StatusBar'
});
</script>

<style scoped>
.status-bar {
  background: #333;
  color: white;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  font-size: 0.9rem;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.status-label {
  color: #aaa;
  margin-bottom: 0.25rem;
  font-size: 0.8rem;
}

.status-value {
  font-weight: bold;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .status-bar {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .status-bar {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .status-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .status-label {
    margin-bottom: 0;
    margin-right: 0.5rem;
  }
}
</style>