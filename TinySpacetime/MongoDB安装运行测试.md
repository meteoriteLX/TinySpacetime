# MongoDB安装运行测试指南

## 1. MongoDB安装

### Windows系统
1. **下载MongoDB**
   - 访问 [MongoDB官网](https://www.mongodb.com/try/download/community)
   - 选择Windows版本，下载.msi安装包

2. **安装MongoDB**
   - 运行下载的.msi文件
   - 选择「Complete」安装类型
   - 勾选「Install MongoDB Compass」（可选，图形化管理工具）
   - 点击「Install」完成安装

3. **配置环境变量**
   - 找到MongoDB安装路径（默认：`C:\Program Files\MongoDB\Server\4.4\bin`）
   - 将该路径添加到系统环境变量的PATH中

### macOS系统
1. **使用Homebrew安装**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **启动MongoDB服务**
   ```bash
   brew services start mongodb/brew/mongodb-community
   ```

### Linux系统
1. **Ubuntu/Debian**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

2. **CentOS/RHEL**
   ```bash
   sudo vi /etc/yum.repos.d/mongodb-org-4.4.repo
   ```
   添加以下内容：
   ```
   [mongodb-org-4.4]
   name=MongoDB Repository
   baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.4/x86_64/
   gpgcheck=1
   enabled=1
   gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc
   ```
   然后执行：
   ```bash
   sudo yum install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

## 2. MongoDB运行

### 启动MongoDB服务
- **Windows**：
  - 按Win+R，输入`services.msc`
  - 找到「MongoDB Server (MongoDB)」服务
  - 右键点击「启动」

- **macOS**：
  ```bash
  brew services start mongodb/brew/mongodb-community
  ```

- **Linux**：
  ```bash
  sudo systemctl start mongod
  ```

### 验证MongoDB服务状态
- **Windows**：
  ```powershell
  net start | findstr MongoDB
  ```

- **macOS/Linux**：
  ```bash
  sudo systemctl status mongod
  ```

### 连接到MongoDB
- 使用Mongo Shell：
  ```bash
  mongo
  ```

- 使用MongoDB Compass：
  - 打开MongoDB Compass
  - 连接字符串：`mongodb://localhost:27017`
  - 点击「Connect」

## 3. 测试数据库连接

### 运行服务器
1. **进入server目录**
   ```bash
   cd e:\desktop\TinySpacetime\TinySpacetime\server
   ```

2. **安装依赖**（如果尚未安装）
   ```bash
   npm install
   ```

3. **启动服务器**
   ```bash
   node server.js
   ```

4. **验证服务器启动**
   - 查看控制台输出：`Server running on port 5000`
   - 查看控制台输出：`MongoDB connected successfully`

### 测试API接口

#### 1. 测试用户注册
- **请求**：
  ```bash
  curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"username": "testuser"}'
  ```
- **预期响应**：
  ```json
  {"message": "User registered successfully", "user": {"_id": "...", "username": "testuser", "created_at": "..."}}
  ```

#### 2. 测试用户登录
- **请求**：
  ```bash
  curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"username": "testuser"}'
  ```
- **预期响应**：
  ```json
  {"message": "Login successful", "user": {"_id": "...", "username": "testuser", "created_at": "..."}}
  ```

#### 3. 测试角色创建
- **请求**：
  ```bash
  curl -X POST http://localhost:5000/api/character -H "Content-Type: application/json" -d '{"user_id": "<用户ID>", "name": "测试角色", "strength": 50, "agility": 60, "intelligence": 70, "skills": {"格斗": 50, "侦查": 60, "交涉": 40}}'
  ```
- **预期响应**：
  ```json
  {"message": "Character created successfully", "character": {...}}
  ```

#### 4. 测试获取角色列表
- **请求**：
  ```bash
  curl http://localhost:5000/api/character/<用户ID>
  ```
- **预期响应**：
  ```json
  [{"_id": "...", "name": "测试角色", ...}]
  ```

#### 5. 测试故事创建
- **请求**：
  ```bash
  curl -X POST http://localhost:5000/api/story -H "Content-Type: application/json" -d '{"name": "测试故事", "description": "这是一个测试故事", "world": "测试世界"}'
  ```
- **预期响应**：
  ```json
  {"message": "Story created successfully", "story": {...}}
  ```

#### 6. 测试获取故事列表
- **请求**：
  ```bash
  curl http://localhost:5000/api/story
  ```
- **预期响应**：
  ```json
  [{"_id": "...", "name": "测试故事", ...}]
  ```

## 4. 查看数据库数据

### 使用MongoDB Compass
1. 打开MongoDB Compass
2. 连接到`mongodb://localhost:27017`
3. 选择`tinyspacetime`数据库
4. 查看以下集合：
   - `users`：用户数据
   - `characters`：角色数据
   - `stories`：故事数据

### 使用Mongo Shell
1. 打开Mongo Shell
2. 连接到`tinyspacetime`数据库：
   ```javascript
   use tinyspacetime
   ```
3. 查看集合数据：
   ```javascript
   db.users.find()
   db.characters.find()
   db.stories.find()
   ```

## 5. 常见问题排查

### MongoDB服务启动失败
- **检查端口是否被占用**：
  ```bash
  netstat -ano | findstr :27017
  ```
- **检查日志文件**：
  - Windows：`C:\Program Files\MongoDB\Server\4.4\log\mongod.log`
  - Linux：`/var/log/mongodb/mongod.log`

### 数据库连接失败
- **检查MongoDB服务是否运行**
- **检查连接字符串是否正确**
- **检查防火墙是否阻止连接**

### API请求失败
- **检查服务器是否运行**
- **检查请求参数是否正确**
- **查看服务器控制台输出的错误信息**

## 6. 总结

通过以上步骤，您应该能够：
1. 成功安装并运行MongoDB
2. 启动我们的服务器并连接到MongoDB
3. 测试各个API接口
4. 查看数据库中存储的数据

如果遇到任何问题，请参考常见问题排查部分，或查看MongoDB官方文档获取更多帮助。
