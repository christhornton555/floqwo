const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');  // Import the Task model
const router = express.Router();

// Sample in-memory data store (for now, we'll use an array of tasks)
let tasks = [];

// Route to get all tasks (READ)
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();  // Retrieve all tasks from MongoDB
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Route to create a new task (CREATE) with validation
router.post(
  '/tasks',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create a new task using the Task model
    try {
      const task = new Task({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || 'pending',
      });
      const savedTask = await task.save();  // Save the task to MongoDB
      res.status(201).json(savedTask);
    } catch (err) {
      res.status(500).json({ error: 'Error creating task' });
    }
  }
);

// Route to update a task (UPDATE)
router.put('/tasks/:id', async (req, res) => {
  try {
    // Find the task by ID
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update the task fields
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    
    // Check if the status is updated to "completed"
    if (req.body.status === 'completed' && task.status !== 'completed') {
      task.completedAt = Date.now();  // Set completedAt to the current date
    }

    // Update the status
    task.status = req.body.status || task.status;

    // Save the updated task
    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Error updating task' });
  }
});

// Route to delete a task (DELETE)
router.delete('/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();  // No content response on successful deletion
  } catch (err) {
    res.status(500).json({ error: 'Error deleting task' });
  }
});

module.exports = router;
