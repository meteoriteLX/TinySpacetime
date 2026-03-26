/**
 * db.js - 数据库配置文件
 * 功能：配置MongoDB连接，处理连接错误
 */

// 导入Mongoose
const mongoose = require('mongoose'); // MongoDB ODM

/**
 * 连接数据库函数
 * @returns {Promise<void>} - 连接结果
 */
const connectDB = async () => {
  try {
    // 使用环境变量中的MongoDB连接字符串
    // 如果环境变量未设置，使用本地MongoDB连接
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/tinyspacetime';

    // 连接MongoDB
    // 配置连接选项，确保正确处理中文
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    // 处理连接错误
    console.error('MongoDB connection error:', error);
    process.exit(1); // 退出进程
  }
};

// 导出连接函数
module.exports = connectDB;
