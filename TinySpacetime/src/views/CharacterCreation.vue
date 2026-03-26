<template>
  <div class="character-creation">
    <h1>TinySpacetime</h1>
    <h2>创建你的角色</h2>
    
    <!-- 登录/注册部分 -->
    <div v-if="!gameStore.currentUser" class="auth-section">
      <h3>请先登录</h3>
      <div class="auth-form">
        <input 
          type="text" 
          v-model="username" 
          placeholder="请输入用户名"
          required
        />
        <div class="auth-buttons">
          <button @click="handleLogin">登录</button>
          <button @click="handleRegister">注册</button>
        </div>
      </div>
      <div v-if="gameStore.error" class="error-message">
        {{ gameStore.error }}
      </div>
    </div>
    
    <!-- 角色创建部分 -->
    <div v-else class="creation-section">
      <CharacterCreator @create="handleCreateCharacter" />
      <div v-if="gameStore.error" class="error-message">
        {{ gameStore.error }}
      </div>
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import CharacterCreator from '../components/CharacterCreator.vue';
import { useGameStore } from '../stores/gameStore';
import { characterApi } from '../services/api';
import type { Character } from '../types';

const router = useRouter();
const route = useRoute();
const gameStore = useGameStore();

// 用户名
const username = ref('');

// 成功信息
const successMessage = ref('');

// 检查用户是否有角色
const checkUserCharacters = async () => {
  if (!gameStore.currentUser?.id) return;
  
  try {
    const characters = await characterApi.getByUserId(gameStore.currentUser.id);
    if (characters.length > 0) {
      // 用户已有角色，跳转到主页面
      gameStore.setCurrentCharacter(characters[0]);
      router.push('/main');
    }
    // 如果没有角色，留在当前页面创建角色
  } catch (error) {
    console.error('检查角色失败:', error);
  }
};

// 处理登录
const handleLogin = async () => {
  if (!username.value.trim()) {
    gameStore.error = '请输入用户名';
    return;
  }
  
  try {
    await gameStore.login(username.value);
    // 登录成功后检查是否有角色
    await checkUserCharacters();
  } catch (error) {
    // 错误已在store中处理
  }
};

// 处理注册
const handleRegister = async () => {
  if (!username.value.trim()) {
    gameStore.error = '请输入用户名';
    return;
  }
  
  try {
    await gameStore.register(username.value);
    // 注册成功后留在当前页面创建角色
  } catch (error) {
    // 错误已在store中处理
  }
};

// 处理角色创建
const handleCreateCharacter = async (characterData: Omit<Character, 'id' | 'user_id' | 'created_at'>) => {
  try {
    await gameStore.createCharacter(characterData);
    successMessage.value = '角色创建成功！';
    // 跳转到主页面（故事选择）
    setTimeout(() => {
      router.push('/main');
    }, 1000);
  } catch (error) {
    // 错误已在store中处理
  }
};

// 页面加载时检查
onMounted(() => {
  // 只有当不是主动点击"创建新角色"时才自动检查
  // 如果URL中有 create=true 参数，说明用户主动想创建新角色，不自动跳转
  const isCreatingNew = route.query.create === 'true';
  if (gameStore.currentUser && !isCreatingNew) {
    checkUserCharacters();
  }
});

// 显式导出组件
defineOptions({
  name: 'CharacterCreation'
});
</script>

<style scoped>
.character-creation {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
}

h2 {
  color: #555;
  margin-bottom: 2rem;
}

.auth-section {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

h3 {
  color: #666;
  margin-bottom: 1.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.auth-form input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.auth-buttons button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.auth-buttons button:first-child {
  background: #2196f3;
  color: white;
}

.auth-buttons button:first-child:hover {
  background: #1976d2;
}

.auth-buttons button:last-child {
  background: #4caf50;
  color: white;
}

.auth-buttons button:last-child:hover {
  background: #45a049;
}

.creation-section {
  margin-top: 2rem;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 4px;
  margin: 1rem 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.success-message {
  background: #e8f5e8;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}
</style>
