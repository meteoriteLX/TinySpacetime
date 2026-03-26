const express = require('express');
const router = express.Router();
const Dialogue = require('../../models/Dialogue');

// 创建新对话
router.post('/', async (req, res) => {
  console.log('POST /api/dialogue - Request received:', req.body);
  try {
    const { character_id, story_id, content, is_user } = req.body;
    
    const dialogue = new Dialogue({
      character_id,
      story_id,
      content,
      is_user,
    });

    await dialogue.save();
    console.log('Dialogue saved successfully:', dialogue);
    res.json({ message: 'Dialogue created successfully', dialogue });
  } catch (error) {
    console.error('Error creating dialogue:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 根据角色ID和故事ID获取对话历史
router.get('/:character_id/:story_id', async (req, res) => {
  console.log('GET /api/dialogue/:character_id/:story_id - Request received:', req.params);
  try {
    const { character_id, story_id } = req.params;
    const dialogues = await Dialogue.find({ character_id, story_id }).sort({ timestamp: 1 });
    res.json(dialogues);
  } catch (error) {
    console.error('Error getting dialogues:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;