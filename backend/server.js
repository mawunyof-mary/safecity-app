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
// Add this near the top of server.js (after imports)
console.log('🔧 Starting SafeCity Backend...');
console.log('📊 Environment:', process.env.NODE_ENV);
console.log('🗄️ MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not Set');

// Update the MongoDB connection with better error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/safecity', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s
  socketTimeoutMS: 45000, // Close sockets after 45s
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  console.log('📁 Database:', mongoose.connection.db.databaseName);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('⚠️  Application starting without database connection');
  console.log('💡 Please set MONGODB_URI environment variable');
});
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
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
