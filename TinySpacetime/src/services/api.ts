import axios from 'axios';
import type { Character, User, Story, Dialogue } from '../types';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 认证相关API
export const authApi = {
  // 注册用户
  register: async (username: string): Promise<User> => {
    const response = await api.post('/auth/register', { username });
    const user = response.data.user;
    // 转换 _id 为 id
    return { ...user, id: user._id, _id: undefined };
  },
  // 登录用户
  login: async (username: string): Promise<User> => {
    const response = await api.post('/auth/login', { username });
    const user = response.data.user;
    // 转换 _id 为 id
    return { ...user, id: user._id, _id: undefined };
  }
};

// 角色相关API
export const characterApi = {
  // 创建角色
  create: async (character: Omit<Character, 'id' | 'user_id' | 'created_at'>, userId: string): Promise<Character> => {
    const response = await api.post('/character', { ...character, user_id: userId });
    const char = response.data.character;
    // 转换 _id 为 id
    return { ...char, id: char._id, _id: undefined };
  },
  // 获取角色列表
  getByUserId: async (userId: string): Promise<Character[]> => {
    const response = await api.get(`/character/${userId}`);
    // 转换 _id 为 id
    return response.data.map((char: any) => ({
      ...char,
      id: char._id,
      _id: undefined
    }));
  }
};

// 故事相关API
export const storyApi = {
  // 创建故事
  create: async (story: Omit<Story, 'id' | 'created_at'>): Promise<Story> => {
    const response = await api.post('/story', story);
    const storyData = response.data.story;
    // 转换 _id 为 id
    return { ...storyData, id: storyData._id, _id: undefined };
  },
  // 获取故事列表
  getAll: async (): Promise<Story[]> => {
    const response = await api.get('/story');
    // 转换 _id 为 id
    return response.data.map((story: any) => ({
      ...story,
      id: story._id,
      _id: undefined
    }));
  }
};

// 对话相关API
export const dialogueApi = {
  // 创建对话
  create: async (dialogue: Omit<Dialogue, 'id' | 'timestamp'>): Promise<Dialogue> => {
    const response = await api.post('/dialogue', dialogue);
    const dialog = response.data.dialogue;
    // 转换 _id 为 id
    return { ...dialog, id: dialog._id, _id: undefined };
  },
  // 获取对话历史
  getByCharacterAndStory: async (characterId: string, storyId: string): Promise<Dialogue[]> => {
    const response = await api.get(`/dialogue/${characterId}/${storyId}`);
    // 转换 _id 为 id
    return response.data.map((dialog: any) => ({
      ...dialog,
      id: dialog._id,
      _id: undefined
    }));
  }
};

export default api;