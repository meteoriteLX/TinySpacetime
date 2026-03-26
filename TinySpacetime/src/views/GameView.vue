<template>
  <div class="game-view">
    <!-- 顶部状态栏 -->
    <StatusBar 
      :location="gameStore.status.location"
      :time="gameStore.status.time"
      :event="gameStore.status.event"
      :relationships="gameStore.status.relationships"
    />
    
    <!-- 故事展示区域 -->
    <div class="story-display">
      <h2>{{ gameStore.currentStory?.name || '游戏' }}</h2>
      
      <!-- 对话历史 -->
      <div class="dialogue-history" ref="dialogueHistory">
        <div 
          v-for="(dialogue, index) in gameStore.dialogues" 
          :key="dialogue.id || index"
          :class="['dialogue', dialogue.is_user ? 'user' : 'ai']"
        >
          <div class="dialogue-content">
            {{ dialogue.content }}
          </div>
        </div>
        
        <!-- 加载中 -->
        <div v-if="gameStore.loading" class="loading">
          <div class="loading-spinner"></div>
          <span>AI正在思考...</span>
        </div>
      </div>
      
      <!-- 输入区域 -->
      <div class="input-area">
        <input 
          type="text" 
          v-model="inputMessage" 
          placeholder="输入你的行动或对话... (输入 /roll 进行骰子判定)"
          @keyup.enter="handleSend"
        />
        <button @click="handleSend" :disabled="!inputMessage.trim()">
          发送
        </button>
      </div>
    </div>
    
    <!-- 右侧角色信息 -->
    <div class="character-info">
      <h3>角色信息</h3>
      <div v-if="gameStore.currentCharacter" class="character-details">
        <p><strong>名称:</strong> {{ gameStore.currentCharacter.name }}</p>
        
        <div class="info-section">
          <h4>属性</h4>
          <p><strong>力量:</strong> {{ gameStore.currentCharacter.attributes?.strength }}</p>
          <p><strong>敏捷:</strong> {{ gameStore.currentCharacter.attributes?.agility }}</p>
          <p><strong>智力:</strong> {{ gameStore.currentCharacter.attributes?.intelligence }}</p>
        </div>
        
        <div class="info-section">
          <h4>技能</h4>
          <p><strong>侦查:</strong> {{ gameStore.currentCharacter.skills?.investigation }}</p>
          <p><strong>话术:</strong> {{ gameStore.currentCharacter.skills?.persuasion }}</p>
          <p><strong>潜行:</strong> {{ gameStore.currentCharacter.skills?.stealth }}</p>
        </div>
      </div>
      <div v-else class="no-character">
        未选择角色
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import StatusBar from '../components/StatusBar.vue';
import { useGameStore } from '../stores/gameStore';
import api from '../services/api';

// 路由
const router = useRouter();

// 游戏状态
const gameStore = useGameStore();

// 输入信息
const inputMessage = ref('');

// 对话历史引用
const dialogueHistory = ref<HTMLElement>();

// 监听对话变化，自动滚动到底部
watch(() => gameStore.dialogues.length, () => {
  scrollToBottom();
});

// 滚动到底部
const scrollToBottom = () => {
  setTimeout(() => {
    if (dialogueHistory.value) {
      dialogueHistory.value.scrollTop = dialogueHistory.value.scrollHeight;
    }
  }, 100);
};

// 处理发送消息
const handleSend = async () => {
  const message = inputMessage.value.trim();
  if (!message) return;
  
  // 检查是否是骰子指令
  if (message === '/roll') {
    // 生成随机数
    const rollResult = Math.floor(Math.random() * 100) + 1;
    const rollMessage = `你掷出了 ${rollResult}`;
    
    // 添加用户对话
    await gameStore.addDialogue(rollMessage, true);
    
    // 生成AI回复
    const aiResponse = generateRollResponse(rollResult);
    await gameStore.addDialogue(aiResponse, false);
  } else {
    // 普通消息
    await gameStore.addDialogue(message, true);
    
    // 调用AI生成回复
    try {
      const aiResponse = await generateAIResponse(message);
      await gameStore.addDialogue(aiResponse, false);
    } catch (error) {
      console.error('AI生成失败:', error);
      await gameStore.addDialogue('AI暂时无法响应，请稍后再试。', false);
    }
  }
  
  // 清空输入
  inputMessage.value = '';
};

// 生成骰子判定响应
const generateRollResponse = (rollResult: number): string => {
  let response = `骰子结果: ${rollResult}`;
  
  if (rollResult <= 5) {
    response += ' - 大成功！你的行动非常顺利！';
  } else if (rollResult <= 50) {
    response += ' - 成功！你的行动取得了预期的效果。';
  } else if (rollResult <= 95) {
    response += ' - 失败。你的行动没有达到预期效果。';
  } else {
    response += ' - 大失败！你的行动出现了严重的问题。';
  }
  
  return response;
};

// 生成AI响应（调用后端API）
const generateAIResponse = async (message: string): Promise<string> => {
  try {
    // 构建请求数据
    const response = await api.post('/story/ai', {
      prompt: message,
      history: gameStore.dialogues.map(d => ({
        content: d.content,
        is_user: d.is_user
      }))
    });
    return response.data.response;
  } catch (error) {
    console.error('AI API调用失败:', error);
    // 失败时使用默认回复
    return `你说: "${message}"，我理解了。让我想想...`;
  }
};

// 检查是否有角色和故事
onMounted(async () => {
  if (!gameStore.currentUser) {
    router.push('/');
    return;
  }
  
  if (!gameStore.currentCharacter) {
    router.push('/');
    return;
  }
  
  if (!gameStore.currentStory) {
    // 加载故事列表
    try {
      const stories = await gameStore.loadStories();
      if (stories.length > 0) {
        gameStore.setCurrentStory(stories[0]);
      } else {
        // 创建默认故事
        const defaultStory = {
          name: '默认故事',
          description: '一个神秘的冒险故事',
          world: '奇幻世界'
        };
        // 这里应该调用API创建故事，现在直接设置
        gameStore.setCurrentStory(defaultStory as any);
      }
    } catch (error) {
      console.error('加载故事失败:', error);
    }
  }
  
  // 加载对话历史
  try {
    await gameStore.loadDialogues();
  } catch (error) {
    console.error('加载对话失败:', error);
  }
  
  // 生成初始剧情
  if (gameStore.dialogues.length === 0) {
    const initialMessage = '欢迎来到TinySpacetime！这是一个充满冒险的世界。你准备好了吗？';
    await gameStore.addDialogue(initialMessage, false);
  }
});

// 显式导出组件
defineOptions({
  name: 'GameView'
});
</script>

<style scoped>
.game-view {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-template-rows: auto 1fr;
  grid-template-areas: 
    "status status"
    "story character";
  height: 100vh;
  overflow: hidden;
}

/* 状态栏 */
.status-bar {
  grid-area: status;
  background: #333;
  color: white;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

/* 故事展示区域 */
.story-display {
  grid-area: story;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  padding: 1rem;
  overflow: hidden;
}

.story-display h2 {
  margin-top: 0;
  color: #333;
  margin-bottom: 1rem;
}

/* 对话历史 */
.dialogue-history {
  flex: 1;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dialogue {
  margin-bottom: 1rem;
  max-width: 80%;
  padding: 0.75rem;
  border-radius: 8px;
}

.dialogue.user {
  align-self: flex-end;
  background: #e3f2fd;
  margin-left: auto;
  border-bottom-right-radius: 2px;
}

.dialogue.ai {
  align-self: flex-start;
  background: #f1f1f1;
  border-bottom-left-radius: 2px;
}

/* 加载中 */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  color: #666;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 输入区域 */
.input-area {
  display: flex;
  gap: 0.5rem;
}

.input-area input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.input-area button {
  padding: 0.75rem 1.5rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.input-area button:hover:not(:disabled) {
  background: #45a049;
}

.input-area button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

/* 角色信息 */
.character-info {
  grid-area: character;
  background: #333;
  color: white;
  padding: 1rem;
  overflow-y: auto;
}

.character-info h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid #555;
  padding-bottom: 0.5rem;
}

.character-details p {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.info-section {
  margin-top: 1rem;
}

.info-section h4 {
  margin: 0.75rem 0 0.5rem 0;
  color: #00d4ff;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-section p {
  margin: 0.25rem 0;
  padding: 0.4rem 0.5rem;
  font-size: 0.9rem;
}

.no-character {
  padding: 2rem;
  text-align: center;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .game-view {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas: 
      "status"
      "story"
      "character";
  }
  
  .character-info {
    max-height: 200px;
  }
}
</style>