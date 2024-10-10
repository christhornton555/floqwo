// This script adds a completedAt value to tasks completed before I added that field

require('dotenv').config();  // Load environment variables
const mongoose = require('mongoose');
const Task = require('./models/Task');  // Import the Task model

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Function to update existing tasks with a completed status
const updateCompletedTasks = async () => {
  try {
    // Find all tasks with status "completed" and no "completedAt" field
    const tasksToUpdate = await Task.find({ status: 'completed', completedAt: null });

    // Loop through each task and update the "completedAt" field
    const updates = tasksToUpdate.map(task => {
      task.completedAt = Date.now();  // Or use task.createdAt if you'd like to match the creation datetime instead
      return task.save();
    });

    // Wait for all tasks to be updated
    await Promise.all(updates);

    console.log(`${tasksToUpdate.length} tasks updated successfully!`);
  } catch (err) {
    console.error('Error updating tasks:', err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

// Run the update function
updateCompletedTasks();
