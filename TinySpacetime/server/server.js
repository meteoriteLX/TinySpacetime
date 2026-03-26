/**
 * server.js - 服务器入口文件
 * 功能：启动Express服务器，配置中间件，注册路由，连接数据库
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// 导入路由
const authRoutes = require('./routes/api/auth');
const characterRoutes = require('./routes/api/character');
const storyRoutes = require('./routes/api/story');
const dialogueRoutes = require('./routes/api/dialogue');

// 导入数据库配置
const connectDB = require('./config/db');

// 创建Express应用实例
const app = express();

// 连接数据库
connectDB();

// 中间件配置
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 设置响应编码
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 注册路由
console.log('Registering routes...');
app.use('/api/auth', authRoutes);
console.log('Auth routes registered');
app.use('/api/character', characterRoutes);
console.log('Character routes registered');
app.use('/api/story', storyRoutes);
console.log('Story routes registered');
app.use('/api/dialogue', dialogueRoutes);
console.log('Dialogue routes registered');

// 404处理中间件
app.use((req, res, next) => {
  console.log('404 - Route not found:', req.method, req.path);
  res.status(404).json({ message: 'Route not found', path: req.path, method: req.method });
});

// 端口配置
const PORT = process.env.PORT || 5000;

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});