const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

// Get all tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching tags' });
  }
});

// Create a new tag
router.post('/tags', async (req, res) => {
  const { name, color } = req.body;
  try {
    const newTag = new Tag({ name, color });
    await newTag.save();
    res.status(201).json(newTag);
  } catch (err) {
    res.status(500).json({ error: 'Error creating tag' });
  }
});

// Update a tag
router.put('/tags/:id', async (req, res) => {
  const { name, color } = req.body;
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, { name, color }, { new: true });
    res.json(tag);
  } catch (err) {
    res.status(500).json({ error: 'Error updating tag' });
  }
});

// Delete a tag
router.delete('/tags/:id', async (req, res) => {
  try {
    await Tag.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting tag' });
  }
});

module.exports = router;
