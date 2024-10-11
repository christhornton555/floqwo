const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Import cors
const jwt = require('jsonwebtoken'); // Import JWT
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

// Check there's a JWT key
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined.');
}

// Secret key for JWT
const SECRET_KEY = process.env.JWT_SECRET;

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY); // Remove 'Bearer' from the token
    req.user = decoded; // Store decoded user info in request
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }

  return next();
}

// Login route to get the JWT token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Replace this with real authentication (for demo purposes)
  if (username === process.env.API_USER && password === process.env.API_PASS) {
    // Generate a token that expires in 1 hour
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }

  return res.status(400).send('Invalid credentials');
});

// Protect the /api routes with JWT authentication
app.use('/api', verifyToken);

// Use the task routes for any requests to /api
app.use('/api', taskRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
