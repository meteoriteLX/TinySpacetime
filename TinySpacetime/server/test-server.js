const express = require('express');
const app = express();

app.use(express.json());

// 测试路由
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 导入对话路由
const dialogueRoutes = require('./routes/api/dialogue');
app.use('/api/dialogue', dialogueRoutes);

// 404处理
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.path, method: req.method });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});