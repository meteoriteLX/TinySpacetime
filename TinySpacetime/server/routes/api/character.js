/**
 * character.js - 角色路由
 * 功能：处理角色的创建、获取等请求
 */

// 导入依赖
const express = require('express'); // Express框架
const router = express.Router(); // 路由实例
const Character = require('../../models/Character'); // 角色模型

/**
 * 创建新角色
 * @route POST /api/character
 * @desc 创建新角色
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    // 从请求体中获取角色信息
    const { user_id, name, attributes, skills } = req.body;

    // 创建新角色
    const character = new Character({
      user_id,
      name,
      attributes: {
        strength: attributes?.strength || 33,
        agility: attributes?.agility || 33,
        intelligence: attributes?.intelligence || 33,
      },
      skills: {
        investigation: skills?.investigation || 33,
        persuasion: skills?.persuasion || 33,
        stealth: skills?.stealth || 33,
      },
    });

    // 保存角色
    await character.save();

    // 返回成功响应
    res.json({ message: 'Character created successfully', character });
  } catch (error) {
    // 处理错误
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * 根据用户ID获取角色列表
 * @route GET /api/character/:user_id
 * @desc 根据用户ID获取角色列表
 * @access Public
 */
router.get('/:user_id', async (req, res) => {
  try {
    // 从路径参数中获取用户ID
    const { user_id } = req.params;

    // 查找用户的所有角色
    const characters = await Character.find({ user_id });

    // 返回角色列表
    res.json(characters);
  } catch (error) {
    // 处理错误
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * 根据角色ID获取角色详情
 * @route GET /api/character/detail/:id
 * @desc 根据角色ID获取角色详情
 * @access Public
 */
router.get('/detail/:id', async (req, res) => {
  try {
    // 从路径参数中获取角色ID
    const { id } = req.params;

    // 查找角色
    const character = await Character.findById(id);

    // 检查角色是否存在
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    // 返回角色详情
    res.json(character);
  } catch (error) {
    // 处理错误
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 导出路由
module.exports = router;
