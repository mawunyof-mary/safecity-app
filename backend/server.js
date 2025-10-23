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
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://safecity-app-frontend.onrender.com',
    'https://safecity-app-frontend.onrender.com'
  ],
  credentials: true
}));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/safecity')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log('User ' + userId + ' joined room');
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/incidents', require('./routes/incidents'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: '🚀 SafeCity API is running!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('🎯 Server running on port ' + PORT);
  console.log('🔌 Socket.io server initialized');
});
