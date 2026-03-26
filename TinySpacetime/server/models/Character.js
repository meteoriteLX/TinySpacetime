/**
 * Character.js - 角色模型
 * 功能：定义角色数据结构，存储角色属性、技能等信息
 */

// 导入Mongoose
const mongoose = require('mongoose'); // MongoDB ODM

/**
 * 角色数据模式
 * @type {mongoose.Schema}
 */
const characterSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // 用户ID类型
    ref: 'User', // 引用User模型
    required: true, // 必需字段
  },
  name: {
    type: String, // 角色名称类型
    required: true, // 必需字段
  },
  // 属性对象
  attributes: {
    strength: {
      type: Number, // 力量属性
      required: true,
      min: 1,
      max: 100,
    },
    agility: {
      type: Number, // 敏捷属性
      required: true,
      min: 1,
      max: 100,
    },
    intelligence: {
      type: Number, // 智力属性
      required: true,
      min: 1,
      max: 100,
    },
  },
  // 技能对象
  skills: {
    investigation: {
      type: Number, // 侦查技能
      default: 0,
      min: 0,
      max: 100,
    },
    persuasion: {
      type: Number, // 话术技能
      default: 0,
      min: 0,
      max: 100,
    },
    stealth: {
      type: Number, // 潜行技能
      default: 0,
      min: 0,
      max: 100,
    },
  },
  created_at: {
    type: Date, // 创建时间类型
    default: Date.now, // 默认值为当前时间
  },
});

/**
 * 角色模型
 * @type {mongoose.Model}
 */
const Character = mongoose.model('Character', characterSchema);

// 导出角色模型
module.exports = Character;
