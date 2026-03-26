# Server文件说明

## 核心配置文件

### server.js
- **功能**：服务器入口文件
- **主要职责**：
  - 启动Express服务器
  - 配置中间件（CORS、JSON解析）
  - 注册API路由
  - 连接数据库
  - 提供健康检查接口
- **关键组件**：
  - 导入并配置依赖（express、cors、dotenv）
  - 导入并注册路由（auth、character、story）
  - 导入并调用数据库连接函数
  - 启动服务器并监听指定端口

### config/db.js
- **功能**：数据库配置文件
- **主要职责**：
  - 配置MongoDB连接
  - 处理连接错误
- **关键组件**：
  - 导入mongoose
  - 定义connectDB函数
  - 使用环境变量中的MongoDB连接字符串
  - 处理连接成功和失败的情况

## 数据模型

### models/User.js
- **功能**：用户模型
- **主要职责**：
  - 定义用户数据结构
  - 存储用户基本信息
- **数据结构**：
  - `username`：用户名（唯一，必需）
  - `created_at`：创建时间（默认当前时间）

### models/Character.js
- **功能**：角色模型
- **主要职责**：
  - 定义角色数据结构
  - 存储角色属性、技能等信息
- **数据结构**：
  - `user_id`：所属用户ID（必需，引用User模型）
  - `name`：角色名称（必需）
  - `strength`：力量属性（1-80）
  - `agility`：敏捷属性（1-80）
  - `intelligence`：智力属性（1-80）
  - `skills`：技能对象（默认空对象）
  - `created_at`：创建时间（默认当前时间）

### models/Story.js
- **功能**：故事模型
- **主要职责**：
  - 定义故事数据结构
  - 存储故事基本信息和世界设定
- **数据结构**：
  - `name`：故事名称（必需）
  - `description`：故事描述（必需）
  - `world`：世界设定（必需）
  - `created_at`：创建时间（默认当前时间）

## API路由

### routes/api/auth.js
- **功能**：认证路由
- **主要职责**：
  - 处理用户注册请求
  - 处理用户登录请求
- **路由**：
  - `POST /api/auth/register`：注册新用户
  - `POST /api/auth/login`：用户登录

### routes/api/character.js
- **功能**：角色路由
- **主要职责**：
  - 处理角色创建请求
  - 处理角色获取请求
- **路由**：
  - `POST /api/character`：创建新角色
  - `GET /api/character/:user_id`：根据用户ID获取角色列表
  - `GET /api/character/detail/:id`：根据角色ID获取角色详情

### routes/api/story.js
- **功能**：故事路由
- **主要职责**：
  - 处理故事创建请求
  - 处理故事获取请求
- **路由**：
  - `POST /api/story`：创建新故事
  - `GET /api/story`：获取所有故事
  - `GET /api/story/:id`：根据故事ID获取故事详情

## 服务层

### services/aiService.js
- **功能**：AI服务
- **主要职责**：
  - 与DeepSeek API交互
  - 生成AI响应
  - 处理骰子判定
- **关键方法**：
  - `generateResponse(prompt, context)`：生成AI响应
  - `determineDiceResult(roll, value)`：判定骰子结果（大成功、成功、失败、大失败）

### services/dbService.js
- **功能**：数据库服务
- **主要职责**：
  - 封装数据库操作
  - 提供用户、角色、故事的CRUD方法
- **关键方法**：
  - 用户操作：`createUser`、`findUserByUsername`
  - 角色操作：`createCharacter`、`findCharactersByUserId`、`findCharacterById`
  - 故事操作：`createStory`、`findAllStories`、`findStoryById`

## 环境配置

### .env
- **功能**：环境变量文件
- **主要职责**：
  - 存储MongoDB连接字符串
  - 存储端口配置
  - 存储DeepSeek API密钥（后续添加）
- **配置项**：
  - `MONGO_URI`：MongoDB连接字符串
  - `PORT`：服务器端口
  - `DEEPSEEK_API_KEY`：DeepSeek API密钥（注释状态）

## 总结

Server目录的文件结构遵循了典型的Express应用架构，采用了模块化设计：

1. **配置层**：负责环境配置和数据库连接
2. **模型层**：定义数据结构和数据库交互
3. **路由层**：处理HTTP请求和响应
4. **服务层**：封装业务逻辑和外部API调用

这种结构使得代码组织清晰，易于维护和扩展。每个文件都有明确的职责，通过模块化的方式组合在一起，形成完整的后端系统。
