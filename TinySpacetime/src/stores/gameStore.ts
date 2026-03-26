import { defineStore } from 'pinia';
import type { Character, User, Story, GameState } from '../types';
import { authApi, characterApi, storyApi, dialogueApi } from '../services/api';

// 定义游戏状态存储
export const useGameStore = defineStore('game', {
  state: (): GameState & { currentUser: User | null; loading: boolean; error: string | null } => ({
    currentUser: null,
    currentCharacter: null,
    currentStory: null,
    dialogues: [],
    status: {
      location: '未知地点',
      time: '未知时间',
      event: '平静',
      relationships: {}
    },
    loading: false,
    error: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.currentUser,
    hasCharacter: (state) => !!state.currentCharacter,
    hasStory: (state) => !!state.currentStory,
    dialogueCount: (state) => state.dialogues.length
  },

  actions: {
    // 用户认证
    async register(username: string) {
      try {
        this.loading = true;
        this.error = null;
        const user = await authApi.register(username);
        this.currentUser = user;
        return user;
      } catch (error) {
        this.error = '注册失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async login(username: string) {
      try {
        this.loading = true;
        this.error = null;
        const user = await authApi.login(username);
        this.currentUser = user;
        return user;
      } catch (error) {
        this.error = '登录失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 角色管理
    async createCharacter(characterData: Omit<Character, 'id' | 'user_id' | 'created_at'>) {
      if (!this.currentUser) {
        throw new Error('用户未登录');
      }

      try {
        this.loading = true;
        this.error = null;
        const character = await characterApi.create(characterData, this.currentUser.id!);
        this.currentCharacter = character;
        return character;
      } catch (error) {
        this.error = '创建角色失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async loadCharacters() {
      if (!this.currentUser) {
        throw new Error('用户未登录');
      }

      try {
        this.loading = true;
        this.error = null;
        const characters = await characterApi.getByUserId(this.currentUser.id!);
        return characters;
      } catch (error) {
        this.error = '加载角色失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setCurrentCharacter(character: Character) {
      this.currentCharacter = character;
    },

    // 故事管理
    async loadStories() {
      try {
        this.loading = true;
        this.error = null;
        const stories = await storyApi.getAll();
        return stories;
      } catch (error) {
        this.error = '加载故事失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setCurrentStory(story: Story) {
      this.currentStory = story;
      this.dialogues = [];
    },

    // 对话管理
    async addDialogue(content: string, isUser: boolean) {
      if (!this.currentCharacter || !this.currentStory) {
        throw new Error('角色或故事未设置');
      }

      try {
        this.loading = true;
        this.error = null;
        const dialogue = await dialogueApi.create({
          character_id: this.currentCharacter.id!,
          story_id: this.currentStory.id!,
          content,
          is_user: isUser
        });
        this.dialogues.push(dialogue);
        return dialogue;
      } catch (error) {
        this.error = '添加对话失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async loadDialogues() {
      if (!this.currentCharacter || !this.currentStory) {
        throw new Error('角色或故事未设置');
      }

      try {
        this.loading = true;
        this.error = null;
        const dialogues = await dialogueApi.getByCharacterAndStory(
          this.currentCharacter.id!,
          this.currentStory.id!
        );
        this.dialogues = dialogues;
        return dialogues;
      } catch (error) {
        this.error = '加载对话失败';
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 状态栏管理
    updateStatus(status: Partial<GameState['status']>) {
      this.status = { ...this.status, ...status };
    },

    // 重置状态
    resetState() {
      this.currentUser = null;
      this.currentCharacter = null;
      this.currentStory = null;
      this.dialogues = [];
      this.status = {
        location: '未知地点',
        time: '未知时间',
        event: '平静',
        relationships: {}
      };
      this.error = null;
    }
  }
});