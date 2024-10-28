const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  
const jwt = require('jsonwebtoken'); 
const taskRoutes = require('./routes/taskRoutes');
const tagRoutes = require('./routes/tagRoutes');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Check for required JWT key
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined.');
}

const SECRET_KEY = process.env.JWT_SECRET;

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY);
    req.user = decoded; 
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }

  return next();
}

// Login route to get the JWT token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.API_USER && password === process.env.API_PASS) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }

  return res.status(400).send('Invalid credentials');
});

// New endpoint to get Tomorrow.io API key (requires JWT)
app.get('/api/weather-key', verifyToken, (req, res) => {
  const weatherKey = process.env.TOMORROW_IO_KEY;
  if (!weatherKey) {
    return res.status(500).json({ error: 'Weather API key not configured' });
  }
  res.json({ key: weatherKey });
});

// Protect the /api routes with JWT authentication
app.use('/api', verifyToken);

// Use the task and tag routes
app.use('/api', taskRoutes);
app.use('/api', tagRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
