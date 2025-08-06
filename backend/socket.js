const { Server } = require('socket.io');

let io;

const init = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // In production, restrict this to your frontend's URL
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`👋 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { init, getIO };