const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "https://safecity-app-frontend.onrender.com"],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://safecity-app-frontend.onrender.com"],
  credentials: true
}));
app.use(express.json());

// Enhanced MongoDB connection with detailed logging
console.log('?? Starting SafeCity Backend...');
console.log('?? Environment:', process.env.NODE_ENV);
console.log('??? MongoDB URI present:', !!process.env.MONGODB_URI);

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.log('? MONGODB_URI environment variable is not set');
      console.log('?? Please set MONGODB_URI in Render environment variables');
      return;
    }
    
    console.log('?? Attempting MongoDB connection...');
    console.log('?? Connection string:', mongoURI.replace(/:[^:]*@/, ':****@')); // Hide password
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('? SUCCESS: Connected to MongoDB!');
    console.log('?? Database:', mongoose.connection.db.databaseName);
    console.log('?? MongoDB ready for operations');
    
  } catch (error) {
    console.error('? FAILED: MongoDB connection error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.name === 'MongoNetworkError') {
      console.log('?? Network issue - check IP whitelisting in MongoDB Atlas');
    } else if (error.name === 'MongoServerError') {
      console.log('?? Authentication issue - check username/password');
    } else if (error.name === 'MongoParseError') {
      console.log('?? Connection string format issue');
    }
  }
};

// Connect to database
connectDB();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('?? New client connected:', socket.id);

  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log('User ' + userId + ' joined room');
  });

  socket.on('disconnect', () => {
    console.log('?? Client disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/incidents', require('./routes/incidents'));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: '?? SafeCity API is running!',
    database: mongoose.connection.readyState === 1 ? 'Connected ?' : 'Disconnected ?'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('?? Server running on port ' + PORT);
  console.log('?? Socket.io server initialized');
});
// Add these auth routes after your MongoDB connection
app.post('/api/auth/register', (req, res) => {
    res.json({ message: 'Register endpoint - working', status: 'success' });
});

app.post('/api/auth/login', (req, res) => {
    res.json({ message: 'Login endpoint - working', status: 'success' });
});

app.get('/api/auth/test', (req, res) => {
    res.json({ message: 'Auth test endpoint - working', status: 'success' });
});

