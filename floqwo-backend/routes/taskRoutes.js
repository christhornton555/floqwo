const express = require('express');
const { body, validationResult } = require('express-validator'); // Import express-validator
const router = express.Router();

// Sample in-memory data store (for now, we'll use an array of tasks)
let tasks = [];

// Route to get all tasks (READ)
router.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Route to create a new task (CREATE) with validation
router.post(
  '/tasks',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
  (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create a new task
    const task = {
      id: tasks.length + 1, // Generate a simple incremental ID
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || 'pending' // Default status is 'pending'
    };
    
    tasks.push(task);
    res.status(201).json(task);
  }
);

// Route to update a task (UPDATE)
router.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Update task details
  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  task.status = req.body.status || task.status;

  res.json(task);
});

// Route to delete a task (DELETE)
router.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1); // Remove task from array
  res.status(204).send(); // Send a no-content response
});

module.exports = router;
