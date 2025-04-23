require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Message Schema
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// Project Schema (if needed)
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', projectSchema);

// API Routes
// Get all messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new message
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Create a new message
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Server-side validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Message Schema
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// Project Schema (if needed)
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', projectSchema);

// API Routes
// Get all messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new message
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Create a new message
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Server-side validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});