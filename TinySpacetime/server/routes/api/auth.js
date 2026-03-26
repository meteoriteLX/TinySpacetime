/**
 * auth.js - 认证路由
 * 功能：处理用户注册和登录请求
 */

// 导入依赖
const express = require('express'); // Express框架
const router = express.Router(); // 路由实例
const User = require('../../models/User'); // 用户模型

/**
 * 注册新用户
 * @route POST /api/auth/register
 * @desc 注册新用户
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    // 从请求体中获取用户名
    const { username } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 创建新用户
    const user = new User({ username });
    await user.save();

    // 返回成功响应
    res.json({ message: 'User registered successfully', user });
  } catch (error) {
    // 处理错误
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * 用户登录
 * @route POST /api/auth/login
 * @desc 用户登录
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    // 从请求体中获取用户名
    const { username } = req.body;

    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // 返回成功响应
    res.json({ message: 'Login successful', user });
  } catch (error) {
    // 处理错误
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 导出路由
module.exports = router;
