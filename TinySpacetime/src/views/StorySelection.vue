<template>
  <div class="story-selection">
    <div class="page-header">
      <h2>选择你的冒险故事</h2>
      <p class="subtitle">选择一个故事世界，开始你的角色扮演之旅</p>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>正在加载故事列表...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadStories" class="retry-btn">重试</button>
    </div>

    <div v-else class="stories-container">
      <div v-if="stories.length === 0" class="no-stories">
        <p>暂无可用故事</p>
        <button @click="createDefaultStory" class="create-btn">创建默认故事</button>
      </div>

      <div v-else class="stories-grid">
        <div
          v-for="story in stories"
          :key="story.id"
          class="story-card"
          :class="{ selected: selectedStory?.id === story.id }"
          @click="selectStory(story)"
        >
          <div class="story-header">
            <h3>{{ story.name }}</h3>
            <span class="story-world">{{ story.world }}</span>
          </div>
          <p class="story-description">{{ story.description }}</p>
          <div class="story-footer">
            <span class="story-date">创建于 {{ formatDate(story.created_at) }}</span>
          </div>
        </div>
      </div>

      <div v-if="selectedStory" class="selection-actions">
        <div class="selected-info">
          <p>已选择: <strong>{{ selectedStory.name }}</strong></p>
        </div>
        <button @click="enterStory" class="enter-btn" :disabled="entering">
          {{ entering ? '进入中...' : '进入故事世界' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { storyApi } from '../services/api'
import type { Story } from '../types'

const router = useRouter()
const gameStore = useGameStore()

const stories = ref<Story[]>([])
const loading = ref(false)
const error = ref('')
const selectedStory = ref<Story | null>(null)
const entering = ref(false)

const loadStories = async () => {
  loading.value = true
  error.value = ''
  try {
    stories.value = await storyApi.getAll()
  } catch (err) {
    error.value = '加载故事列表失败，请稍后重试'
    console.error('加载故事失败:', err)
  } finally {
    loading.value = false
  }
}

const createDefaultStory = async () => {
  loading.value = true
  try {
    const defaultStory = await storyApi.create({
      name: '奇幻冒险',
      description: '在一个充满魔法与神秘的奇幻世界中，你将展开一段惊心动魄的冒险旅程。探索古老的遗迹，与神秘的生物相遇，书写属于你的传奇故事。',
      world: '奇幻世界'
    })
    stories.value.push(defaultStory)
    selectedStory.value = defaultStory
  } catch (err) {
    error.value = '创建故事失败'
    console.error('创建故事失败:', err)
  } finally {
    loading.value = false
  }
}

const selectStory = (story: Story) => {
  selectedStory.value = story
}

const enterStory = async () => {
  if (!selectedStory.value) return

  entering.value = true
  try {
    // 设置当前故事
    gameStore.setCurrentStory(selectedStory.value)
    // 跳转到游戏页面
    router.push('/game')
  } catch (err) {
    console.error('进入故事失败:', err)
    error.value = '进入故事失败，请重试'
  } finally {
    entering.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadStories()
})
</script>

<style scoped>
.story-selection {
  padding: 2rem;
  color: #fff;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #00d4ff, #7b2cbf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #a0a0a0;
  font-size: 1.1rem;
}

.loading {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0, 212, 255, 0.3);
  border-top-color: #00d4ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  padding: 2rem;
  color: #ff6b6b;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #00d4ff;
  color: #1a1a2e;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.no-stories {
  text-align: center;
  padding: 3rem;
  color: #a0a0a0;
}

.create-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #00d4ff, #7b2cbf);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.story-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.story-card:hover {
  border-color: rgba(0, 212, 255, 0.5);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 212, 255, 0.2);
}

.story-card.selected {
  border-color: #00d4ff;
  background: rgba(0, 212, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
}

.story-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.story-header h3 {
  font-size: 1.3rem;
  color: #fff;
  margin: 0;
}

.story-world {
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.story-description {
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.story-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.story-date {
  color: #808080;
  font-size: 0.85rem;
}

.selection-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 212, 255, 0.3);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-info {
  color: #fff;
}

.selected-info strong {
  color: #00d4ff;
}

.enter-btn {
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #00d4ff, #7b2cbf);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.enter-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(0, 212, 255, 0.4);
}

.enter-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>