<template>
  <div class="main-view">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-left">
        <div class="avatar" @click="toggleSidebar">
          <div class="avatar-icon">👤</div>
        </div>
        <h1 class="app-title">TinySpacetime</h1>
      </div>
      <div class="header-right">
        <span class="username">{{ gameStore.currentUser?.username }}</span>
      </div>
    </header>

    <!-- 左侧栏 -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <h2>{{ gameStore.currentUser?.username }}</h2>
        <button class="close-btn" @click="toggleSidebar">×</button>
      </div>

      <div class="sidebar-content">
        <div class="section-title">我的角色</div>
        
        <div v-if="loadingCharacters" class="loading">
          加载中...
        </div>
        
        <div v-else-if="characters.length === 0" class="no-characters">
          还没有创建角色
        </div>
        
        <div v-else class="character-list">
          <div
            v-for="char in characters"
            :key="char.id"
            class="character-item"
            :class="{ active: gameStore.currentCharacter?.id === char.id }"
            @click="switchCharacter(char)"
          >
            <div class="char-name">{{ char.name }}</div>
            <div class="char-stats">
              力{{ char.attributes?.strength }} 敏{{ char.attributes?.agility }} 智{{ char.attributes?.intelligence }}
            </div>
          </div>
        </div>
      </div>

      <div class="sidebar-footer">
        <button class="create-char-btn" @click="goToCreateCharacter">
          + 创建新角色
        </button>
      </div>
    </aside>

    <!-- 遮罩层 -->
    <div 
      class="overlay" 
      :class="{ show: sidebarOpen }"
      @click="toggleSidebar"
    ></div>

    <!-- 主内容区 - 故事选择 -->
    <main class="main-content">
      <StorySelection />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { characterApi } from '../services/api'
import StorySelection from './StorySelection.vue'
import type { Character } from '../types'

const router = useRouter()
const gameStore = useGameStore()

const sidebarOpen = ref(false)
const characters = ref<Character[]>([])
const loadingCharacters = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const loadCharacters = async () => {
  if (!gameStore.currentUser?.id) return
  
  loadingCharacters.value = true
  try {
    characters.value = await characterApi.getByUserId(gameStore.currentUser.id)
  } catch (error) {
    console.error('加载角色列表失败:', error)
  } finally {
    loadingCharacters.value = false
  }
}

const switchCharacter = (character: Character) => {
  gameStore.setCurrentCharacter(character)
  sidebarOpen.value = false
}

const goToCreateCharacter = () => {
  router.push('/?create=true')
}

onMounted(() => {
  loadCharacters()
})
</script>

<style scoped>
.main-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
}

/* 顶部导航栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #00d4ff, #7b2cbf);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.avatar:hover {
  transform: scale(1.1);
}

.avatar-icon {
  font-size: 1.5rem;
}

.app-title {
  font-size: 1.5rem;
  background: linear-gradient(45deg, #00d4ff, #7b2cbf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.username {
  color: #a0a0a0;
  font-size: 0.9rem;
}

/* 左侧栏 */
.sidebar {
  position: fixed;
  top: 0;
  left: -300px;
  width: 300px;
  height: 100vh;
  background: rgba(26, 26, 46, 0.98);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 200;
  transition: left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar.open {
  left: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #00d4ff;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.section-title {
  font-size: 0.85rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
}

.loading,
.no-characters {
  padding: 2rem;
  text-align: center;
  color: #888;
}

.character-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.character-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.character-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.3);
}

.character-item.active {
  background: rgba(0, 212, 255, 0.1);
  border-color: #00d4ff;
}

.char-name {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.char-stats {
  font-size: 0.8rem;
  color: #888;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.create-char-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(45deg, #00d4ff, #7b2cbf);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.3s;
}

.create-char-btn:hover {
  transform: scale(1.02);
}

/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  z-index: 150;
}

.overlay.show {
  opacity: 1;
  visibility: visible;
}

/* 主内容区 */
.main-content {
  padding-top: 80px;
  min-height: 100vh;
}
</style>