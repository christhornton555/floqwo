// This script adds a completedAt value to tasks which are not yet completed

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

// Function to update tasks that don't have a completedAt field
const updateIncompleteTasks = async () => {
  try {
    // Find all tasks where "completedAt" is undefined (both completed and incomplete tasks)
    const tasksToUpdate = await Task.find({ completedAt: { $exists: false } });

    // Loop through each task and set "completedAt" to null
    const updates = tasksToUpdate.map(task => {
      task.completedAt = null;
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
updateIncompleteTasks();
