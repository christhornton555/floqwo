const mongoose = require('mongoose');

// Define the Task schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  dueDate: {  // New field for the due date (optional)
    type: Date
  }
});

// Create the Task model from the schema
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
