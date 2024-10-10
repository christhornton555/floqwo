const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Import cors
const taskRoutes = require('./routes/taskRoutes');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());  // Add this line to enable CORS

// Middleware to parse JSON request bodies
app.use(express.json());

// MongoDB connection (use the connection string from the .env file)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Use the task routes for any requests to /api
app.use('/api', taskRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
