/**
 * User.js - 用户模型
 * 功能：定义用户数据结构，存储用户基本信息
 */

// 导入Mongoose
const mongoose = require('mongoose'); // MongoDB ODM

/**
 * 用户数据模式
 * @type {mongoose.Schema}
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String, // 用户名类型
    required: true, // 必需字段
    unique: true, // 唯一字段
  },
  created_at: {
    type: Date, // 创建时间类型
    default: Date.now, // 默认值为当前时间
  },
});

/**
 * 用户模型
 * @type {mongoose.Model}
 */
const User = mongoose.model('User', userSchema);

// 导出用户模型
module.exports = User;
