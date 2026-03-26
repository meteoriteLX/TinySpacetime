/**
 * Dialogue.js - 对话模型
 * 功能：定义对话数据结构，存储角色与故事之间的对话内容
 */

// 导入Mongoose
const mongoose = require('mongoose'); // MongoDB ODM

/**
 * 对话数据模式
 * @type {mongoose.Schema}
 */
const dialogueSchema = new mongoose.Schema({
  character_id: {
    type: mongoose.Schema.Types.ObjectId, // 角色ID类型
    ref: 'Character', // 引用Character模型
    required: true, // 必需字段
  },
  story_id: {
    type: mongoose.Schema.Types.ObjectId, // 故事ID类型
    ref: 'Story', // 引用Story模型
    required: true, // 必需字段
  },
  content: {
    type: String, // 对话内容类型
    required: true, // 必需字段
  },
  is_user: {
    type: Boolean, // 是否是用户发送的
    required: true, // 必需字段
  },
  timestamp: {
    type: Date, // 时间戳类型
    default: Date.now, // 默认值为当前时间
  },
});

/**
 * 对话模型
 * @type {mongoose.Model}
 */
const Dialogue = mongoose.model('Dialogue', dialogueSchema);

// 导出对话模型
module.exports = Dialogue;