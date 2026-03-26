/**
 * aiService.js - AI服务
 * 功能：处理与DeepSeek API的交互，生成AI回复
 */

// 导入依赖
const axios = require('axios'); // HTTP客户端

/**
 * 生成AI回复
 * @param {string} prompt - 提示词
 * @param {string[]} history - 对话历史
 * @returns {Promise<string>} - AI回复
 */
const generateAIResponse = async (prompt, history = []) => {
  try {
    // 从环境变量中获取API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    // 检查API密钥是否存在
    if (!apiKey) {
      throw new Error('DeepSeek API key not set');
    }
    
    // 构建对话历史
    const messages = [
      {
        role: 'system',
        content: '你是一个文游主持人，负责引导玩家在不同的故事世界中冒险。你的回答应该生动有趣，推动剧情发展，同时尊重玩家的选择。'
      },
      ...history.map(item => ({
        role: item.is_user ? 'user' : 'assistant',
        content: item.content
      })),
      {
        role: 'user',
        content: prompt
      }
    ];
    
    // 调用DeepSeek API
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.95
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    // 提取AI回复
    const aiResponse = response.data.choices[0].message.content;
    return aiResponse;
  } catch (error) {
    console.error('AI generation error:', error);
    // 返回模拟回复，当API不可用时
    return getMockResponse(prompt);
  }
};

/**
 * 获取模拟回复
 * @param {string} prompt - 提示词
 * @returns {string} - 模拟回复
 */
const getMockResponse = (prompt) => {
  const responses = [
    `你说: "${prompt}"，我理解了。让我想想...`,
    `关于"${prompt}"，我需要考虑一下当前的情况。`,
    `你提出了一个有趣的观点: "${prompt}"`,
    `好的，我明白了你的意思: "${prompt}"`,
    `让我根据当前的情况来回应你的话: "${prompt}"`
  ];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return randomResponse;
};

/**
 * 生成故事初始剧情
 * @param {string} storyName - 故事名称
 * @param {string} storyWorld - 故事世界
 * @returns {Promise<string>} - 初始剧情
 */
const generateInitialStory = async (storyName, storyWorld) => {
  try {
    // 从环境变量中获取API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    // 检查API密钥是否存在
    if (!apiKey) {
      throw new Error('DeepSeek API key not set');
    }
    
    // 构建提示词
    const prompt = `请为名为"${storyName}"的故事生成一个初始剧情，故事背景是"${storyWorld}"。剧情应该引人入胜，设置好场景和初始冲突，让玩家有明确的行动方向。`;
    
    // 调用DeepSeek API
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个文游主持人，负责创建引人入胜的故事开头。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 800,
        top_p: 0.95
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    // 提取初始剧情
    const initialStory = response.data.choices[0].message.content;
    return initialStory;
  } catch (error) {
    console.error('Initial story generation error:', error);
    // 返回默认初始剧情
    return `欢迎来到${storyName}！这是一个发生在${storyWorld}的冒险故事。你发现自己站在一个陌生的地方，周围环境充满了神秘的气息。前方有一条小路延伸向远方，右边是一片茂密的森林，左边则是一座古老的建筑。你感觉有什么重要的事情在等待着你去发现...`;
  }
};

// 导出AI服务
exports.generateAIResponse = generateAIResponse;
exports.generateInitialStory = generateInitialStory;