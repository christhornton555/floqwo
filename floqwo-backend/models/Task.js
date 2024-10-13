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
  dueDate: {
    type: Date
  },
  tags: {
    type: [String], // Array of strings for tags
    default: [] // Default to an empty array if no tags are provided
  }
});

// Create the Task model from the schema
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
