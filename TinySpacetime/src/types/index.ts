// 属性类型定义
export interface Attributes {
  strength: number;      // 力量
  agility: number;       // 敏捷
  intelligence: number;  // 智力
}

// 技能类型定义
export interface Skills {
  investigation: number; // 侦查
  persuasion: number;    // 话术
  stealth: number;       // 潜行
}

// 角色类型定义
export interface Character {
  id?: string;
  user_id?: string;
  name: string;
  attributes: Attributes;  // 属性对象
  skills: Skills;          // 技能对象
  created_at?: string;
}

// 用户类型定义
export interface User {
  id?: string;
  username: string;
  created_at?: string;
}

// 故事类型定义
export interface Story {
  id?: string;
  name: string;
  description: string;
  world: string;
  created_at?: string;
}

// 对话类型定义
export interface Dialogue {
  id?: string;
  character_id: string;
  story_id: string;
  content: string;
  is_user: boolean;
  timestamp?: string;
}

// 游戏状态类型定义
export interface GameState {
  currentCharacter: Character | null;
  currentStory: Story | null;
  dialogues: Dialogue[];
  status: {
    location: string;
    time: string;
    event: string;
    relationships: Record<string, string>;
  };
}
