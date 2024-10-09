const express = require('express');
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Import task routes
const taskRoutes = require('./routes/taskRoutes');

// Use the task routes for any requests to /api
app.use('/api', taskRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
