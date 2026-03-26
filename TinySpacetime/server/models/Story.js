/**
 * Story.js - 故事模型
 * 功能：定义故事数据结构，存储故事基本信息和世界设定
 */

// 导入Mongoose
const mongoose = require('mongoose'); // MongoDB ODM

/**
 * 故事数据模式
 * @type {mongoose.Schema}
 */
const storySchema = new mongoose.Schema({
  name: {
    type: String, // 故事名称类型
    required: true, // 必需字段
  },
  description: {
    type: String, // 故事描述类型
    required: true, // 必需字段
  },
  world: {
    type: String, // 世界设定类型
    required: true, // 必需字段
  },
  created_at: {
    type: Date, // 创建时间类型
    default: Date.now, // 默认值为当前时间
  },
});

/**
 * 故事模型
 * @type {mongoose.Model}
 */
const Story = mongoose.model('Story', storySchema);

// 导出故事模型
module.exports = Story;
