/**
 * dbService.js - 数据库服务
 * 功能：封装数据库操作，提供用户、角色、故事的CRUD方法
 */

// 导入模型
const User = require('../models/User'); // 用户模型
const Character = require('../models/Character'); // 角色模型
const Story = require('../models/Story'); // 故事模型

/**
 * 数据库服务类
 */
class DBService {
  /**
   * User operations
   */
  
  /**
   * 创建用户
   * @param {string} username - 用户名
   * @returns {Promise<Object>} - 创建的用户对象
   */
  async createUser(username) {
    try {
      const user = new User({ username });
      return await user.save();
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  /**
   * 根据用户名查找用户
   * @param {string} username - 用户名
   * @returns {Promise<Object>} - 找到的用户对象
   */
  async findUserByUsername(username) {
    try {
      return await User.findOne({ username });
    } catch (error) {
      console.error('Find user error:', error);
      throw error;
    }
  }

  /**
   * Character operations
   */
  
  /**
   * 创建角色
   * @param {string} user_id - 用户ID
   * @param {string} name - 角色名称
   * @param {number} strength - 力量属性
   * @param {number} agility - 敏捷属性
   * @param {number} intelligence - 智力属性
   * @param {Object} skills - 技能对象
   * @returns {Promise<Object>} - 创建的角色对象
   */
  async createCharacter(user_id, name, strength, agility, intelligence, skills) {
    try {
      const character = new Character({
        user_id,
        name,
        strength,
        agility,
        intelligence,
        skills,
      });
      return await character.save();
    } catch (error) {
      console.error('Create character error:', error);
      throw error;
    }
  }

  /**
   * 根据用户ID查找角色列表
   * @param {string} user_id - 用户ID
   * @returns {Promise<Array>} - 角色列表
   */
  async findCharactersByUserId(user_id) {
    try {
      return await Character.find({ user_id });
    } catch (error) {
      console.error('Find characters error:', error);
      throw error;
    }
  }

  /**
   * 根据角色ID查找角色
   * @param {string} id - 角色ID
   * @returns {Promise<Object>} - 找到的角色对象
   */
  async findCharacterById(id) {
    try {
      return await Character.findById(id);
    } catch (error) {
      console.error('Find character error:', error);
      throw error;
    }
  }

  /**
   * Story operations
   */
  
  /**
   * 创建故事
   * @param {string} name - 故事名称
   * @param {string} description - 故事描述
   * @param {string} world - 世界设定
   * @returns {Promise<Object>} - 创建的故事对象
   */
  async createStory(name, description, world) {
    try {
      const story = new Story({ name, description, world });
      return await story.save();
    } catch (error) {
      console.error('Create story error:', error);
      throw error;
    }
  }

  /**
   * 查找所有故事
   * @returns {Promise<Array>} - 故事列表
   */
  async findAllStories() {
    try {
      return await Story.find();
    } catch (error) {
      console.error('Find stories error:', error);
      throw error;
    }
  }

  /**
   * 根据故事ID查找故事
   * @param {string} id - 故事ID
   * @returns {Promise<Object>} - 找到的故事对象
   */
  async findStoryById(id) {
    try {
      return await Story.findById(id);
    } catch (error) {
      console.error('Find story error:', error);
      throw error;
    }
  }
}

// 导出数据库服务实例
module.exports = new DBService();
