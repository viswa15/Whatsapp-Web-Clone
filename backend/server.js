const express = require('express');
const http = require('http'); // 1. Import http
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const { init: initSocket } = require('./socket'); // 2. Import socket initializer

// Initialize Express app
const app = express();
const server = http.createServer(app); // 3. Create HTTP server

// 4. Initialize Socket.IO
const io = initSocket(server);

// Connect to Database
connectDB();

// Middleware
app.use(cors());
// Use express.json() with a 'verify' function to capture the raw body
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(bodyParser.urlencoded({ extended: true }));

// Define Routes
app.use('/api', apiRoutes);

// Simple route for testing server is up
app.get('/', (req, res) => {
  res.send('WhatsApp Clone Backend is running with WebSocket support! 🚀');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`)); // 5. Use server.listen