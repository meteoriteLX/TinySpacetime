/**
 * story.js - 故事路由
 * 功能：处理故事的创建、获取等请求
 */

// 导入依赖
const express = require('express'); // Express框架
const router = express.Router(); // 路由实例
const Story = require('../../models/Story'); // 故事模型

/**
 * 创建新故事
 * @route POST /api/story
 * @desc 创建新故事
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    // 从请求体中获取故事信息
    const { name, description, world } = req.body;

    // 创建新故事
    const story = new Story({
      name,
      description,
      world,
    });

    // 保存故事
    await story.save();

    // 返回成功响应
    res.json({ message: 'Story created successfully', story });
  } catch (error) {
    // 处理错误
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * 获取所有故事
 * @route GET /api/story
 * @desc 获取所有故事
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    // 查找所有故事
    const stories = await Story.find();

    // 返回故事列表
    res.json(stories);
  } catch (error) {
    // 处理错误
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * AI 响应生成
 * @route POST /api/story/ai
 * @desc 根据提示词生成 AI 响应
 * @access Public
 */
router.post('/ai', async (req, res) => {
  try {
    // 从请求体中获取提示词和历史记录
    const { prompt, history } = req.body;

    // 调用 DeepSeek API 生成 AI 响应
    const response = await callDeepSeekAPI(prompt, history);

    // 返回 AI 响应
    res.json({ response });
  } catch (error) {
    // 处理错误
    console.error('AI API调用失败:', error);
    res.status(500).json({ message: 'AI服务暂时不可用', error: error.message });
  }
});

/**
 * 调用 DeepSeek API 生成 AI 响应
 * @param {string} prompt - 用户输入
 * @param {Array} history - 对话历史
 * @returns {string} AI 响应
 */
async function callDeepSeekAPI(prompt, history) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY not configured');
  }

  // 构建消息历史
  const messages = [];

  // 添加系统提示
  messages.push({
    role: 'system',
    content: '你是一个富有想象力的故事叙述者，正在参与一个互动式角色扮演游戏。请根据用户的输入，创造生动有趣的回应，推动故事发展。保持友好、富有创造力的语气。'
  });

  // 添加历史对话
  if (history && history.length > 0) {
    history.forEach(item => {
      messages.push({
        role: item.is_user ? 'user' : 'assistant',
        content: item.content
      });
    });
  }

  // 添加当前用户输入
  messages.push({
    role: 'user',
    content: prompt
  });

  // 调用 DeepSeek API
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.8,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`DeepSeek API error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * 根据故事ID获取故事详情
 * @route GET /api/story/:id
 * @desc 根据故事ID获取故事详情
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    // 从路径参数中获取故事ID
    const { id } = req.params;

    // 查找故事
    const story = await Story.findById(id);

    // 检查故事是否存在
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // 返回故事详情
    res.json(story);
  } catch (error) {
    // 处理错误
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 导出路由
module.exports = router;
