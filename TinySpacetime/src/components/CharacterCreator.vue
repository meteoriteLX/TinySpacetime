<template>
  <div class="character-creator">
    <h2>创建角色</h2>
    
    <form @submit.prevent="handleSubmit" class="creator-form">
      <!-- 角色名称 -->
      <div class="form-group">
        <label for="name">角色名称</label>
        <input 
          type="text" 
          id="name" 
          v-model="characterData.name" 
          required 
          placeholder="请输入角色名称"
        />
      </div>
      
      <!-- 属性分配 -->
      <div class="attributes-section">
        <h3>属性分配</h3>
        <p class="point-info">
          总点数: {{ totalAttributePoints }} | 
          已分配: {{ usedAttributePoints }} | 
          剩余: {{ remainingAttributePoints }}
        </p>
        
        <div class="attribute">
          <label for="strength">力量</label>
          <div class="attribute-controls">
            <button type="button" @click="adjustAttribute('strength', -1)" :disabled="characterData.attributes.strength <= 1">-</button>
            <input 
              type="number" 
              id="strength" 
              v-model.number="characterData.attributes.strength" 
              min="1" 
              max="100"
              @input="validateAttribute('strength')"
            />
            <button type="button" @click="adjustAttribute('strength', 1)" :disabled="characterData.attributes.strength >= 100">+</button>
          </div>
        </div>
        
        <div class="attribute">
          <label for="agility">敏捷</label>
          <div class="attribute-controls">
            <button type="button" @click="adjustAttribute('agility', -1)" :disabled="characterData.attributes.agility <= 1">-</button>
            <input 
              type="number" 
              id="agility" 
              v-model.number="characterData.attributes.agility" 
              min="1" 
              max="100"
              @input="validateAttribute('agility')"
            />
            <button type="button" @click="adjustAttribute('agility', 1)" :disabled="characterData.attributes.agility >= 100">+</button>
          </div>
        </div>
        
        <div class="attribute">
          <label for="intelligence">智力</label>
          <div class="attribute-controls">
            <button type="button" @click="adjustAttribute('intelligence', -1)" :disabled="characterData.attributes.intelligence <= 1">-</button>
            <input 
              type="number" 
              id="intelligence" 
              v-model.number="characterData.attributes.intelligence" 
              min="1" 
              max="100"
              @input="validateAttribute('intelligence')"
            />
            <button type="button" @click="adjustAttribute('intelligence', 1)" :disabled="characterData.attributes.intelligence >= 100">+</button>
          </div>
        </div>
      </div>
      
      <!-- 技能分配 -->
      <div class="skills-section">
        <h3>技能分配</h3>
        <p class="point-info">
          总点数: {{ totalSkillPoints }} | 
          已分配: {{ usedSkillPoints }} | 
          剩余: {{ remainingSkillPoints }}
        </p>
        
        <div class="skill">
          <label for="investigation">
            <span class="skill-name">侦查</span>
            <span class="skill-desc">发现隐藏线索和细节的能力</span>
          </label>
          <div class="skill-controls">
            <button type="button" @click="adjustSkill('investigation', -1)" :disabled="characterData.skills.investigation <= 0">-</button>
            <input 
              type="number" 
              id="investigation" 
              v-model.number="characterData.skills.investigation" 
              min="0" 
              max="100"
              @input="validateSkill('investigation')"
            />
            <button type="button" @click="adjustSkill('investigation', 1)" :disabled="characterData.skills.investigation >= 100">+</button>
          </div>
        </div>
        
        <div class="skill">
          <label for="persuasion">
            <span class="skill-name">话术</span>
            <span class="skill-desc">说服他人和影响对话的能力</span>
          </label>
          <div class="skill-controls">
            <button type="button" @click="adjustSkill('persuasion', -1)" :disabled="characterData.skills.persuasion <= 0">-</button>
            <input 
              type="number" 
              id="persuasion" 
              v-model.number="characterData.skills.persuasion" 
              min="0" 
              max="100"
              @input="validateSkill('persuasion')"
            />
            <button type="button" @click="adjustSkill('persuasion', 1)" :disabled="characterData.skills.persuasion >= 100">+</button>
          </div>
        </div>
        
        <div class="skill">
          <label for="stealth">
            <span class="skill-name">潜行</span>
            <span class="skill-desc">隐藏身形和悄悄移动的能力</span>
          </label>
          <div class="skill-controls">
            <button type="button" @click="adjustSkill('stealth', -1)" :disabled="characterData.skills.stealth <= 0">-</button>
            <input 
              type="number" 
              id="stealth" 
              v-model.number="characterData.skills.stealth" 
              min="0" 
              max="100"
              @input="validateSkill('stealth')"
            />
            <button type="button" @click="adjustSkill('stealth', 1)" :disabled="characterData.skills.stealth >= 100">+</button>
          </div>
        </div>
      </div>
      
      <!-- 错误提示 -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <!-- 提交按钮 -->
      <button 
        type="submit" 
        class="submit-btn" 
        :disabled="!characterData.name.trim()"
      >
        创建角色
      </button>
      
      <p class="hint">提示：有剩余点数也可以创建角色</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Character, Attributes, Skills } from '../types';

// 定义emit
const emit = defineEmits<{
  (e: 'create', character: Omit<Character, 'id' | 'user_id' | 'created_at'>): void;
}>();

// 总点数限制
const totalAttributePoints = 100;
const totalSkillPoints = 100;

// 默认分配（平均分）
const defaultAttributeValue = Math.floor(totalAttributePoints / 3); // 33
const defaultSkillValue = Math.floor(totalSkillPoints / 3); // 33

// 角色数据
const characterData = ref<Omit<Character, 'id' | 'user_id' | 'created_at'>>({
  name: '',
  attributes: {
    strength: defaultAttributeValue,
    agility: defaultAttributeValue,
    intelligence: defaultAttributeValue,
  },
  skills: {
    investigation: defaultSkillValue,
    persuasion: defaultSkillValue,
    stealth: defaultSkillValue,
  },
});

// 计算已分配的属性点数
const usedAttributePoints = computed(() => {
  return characterData.value.attributes.strength + 
         characterData.value.attributes.agility + 
         characterData.value.attributes.intelligence;
});

// 计算剩余的属性点数
const remainingAttributePoints = computed(() => {
  return totalAttributePoints - usedAttributePoints.value;
});

// 计算已分配的技能点数
const usedSkillPoints = computed(() => {
  return characterData.value.skills.investigation + 
         characterData.value.skills.persuasion + 
         characterData.value.skills.stealth;
});

// 计算剩余的技能点数
const remainingSkillPoints = computed(() => {
  return totalSkillPoints - usedSkillPoints.value;
});

// 错误信息
const error = ref('');

// 调整属性值
const adjustAttribute = (attribute: keyof Attributes, delta: number) => {
  const currentValue = characterData.value.attributes[attribute];
  const newValue = currentValue + delta;
  
  if (newValue >= 1 && newValue <= 100) {
    characterData.value.attributes[attribute] = newValue;
    error.value = '';
  }
};

// 验证属性值
const validateAttribute = (attribute: keyof Attributes) => {
  let value = characterData.value.attributes[attribute];
  
  // 确保值在有效范围内
  if (isNaN(value) || value < 1) {
    value = 1;
  } else if (value > 100) {
    value = 100;
  }
  
  characterData.value.attributes[attribute] = value;
  error.value = '';
};

// 调整技能值
const adjustSkill = (skill: keyof Skills, delta: number) => {
  const currentValue = characterData.value.skills[skill];
  const newValue = currentValue + delta;
  
  if (newValue >= 0 && newValue <= 100) {
    characterData.value.skills[skill] = newValue;
    error.value = '';
  }
};

// 验证技能值
const validateSkill = (skill: keyof Skills) => {
  let value = characterData.value.skills[skill];
  
  // 确保值在有效范围内
  if (isNaN(value) || value < 0) {
    value = 0;
  } else if (value > 100) {
    value = 100;
  }
  
  characterData.value.skills[skill] = value;
  error.value = '';
};

// 处理表单提交
const handleSubmit = () => {
  if (!characterData.value.name.trim()) {
    error.value = '请输入角色名称';
    return;
  }
  
  emit('create', characterData.value);
};

// 显式导出组件
defineOptions({
  name: 'CharacterCreator'
});
</script>

<style scoped>
.character-creator {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.creator-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: bold;
  color: #555;
}

input[type="text"] {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.attributes-section,
.skills-section {
  background: #fff;
  padding: 1.5rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

h3 {
  margin-top: 0;
  color: #333;
  margin-bottom: 1rem;
}

.point-info {
  text-align: right;
  font-weight: bold;
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.attribute,
.skill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 4px;
}

.skill {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.skill label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.skill-name {
  font-weight: bold;
  color: #333;
}

.skill-desc {
  font-size: 0.85rem;
  color: #888;
  font-weight: normal;
}

.attribute-controls,
.skill-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.attribute-controls button,
.skill-controls button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.attribute-controls button:disabled,
.skill-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.attribute-controls input,
.skill-controls input {
  width: 60px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.submit-btn {
  padding: 1rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #45a049;
}

.submit-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.hint {
  text-align: center;
  color: #888;
  font-size: 0.9rem;
  margin-top: -1rem;
}
</style>
