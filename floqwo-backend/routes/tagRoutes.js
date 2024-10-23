const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');
const Task = require('../models/Task');  // Import the Task model

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

// Update a tag (name and color) and update related tasks
router.put('/tags/:id', async (req, res) => {
  const { name, color } = req.body;
  try {
    // Find the existing tag
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    const oldTagName = tag.name;

    // Update the tag's name and color
    tag.name = name || tag.name;
    tag.color = color || tag.color;
    await tag.save();

    // Update all tasks that have the old tag name
    await Task.updateMany(
      { tags: oldTagName },  // Find tasks with the old tag name
      { $set: { 'tags.$': name } }  // Update the tag in the task
    );

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
