const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

// Create express app
const app = express();
require("dotenv").config();

// Create HTTP server using the Express app
const server = http.createServer(app);

// Create Socket.io instance with the HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL?.trim(), // Trim to remove any whitespace or trailing slashes
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Express middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL?.trim(), // Trim to remove any whitespace or trailing slashes
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("Welcome our chat app APIs..");
});

// MongoDB Connection
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connection established"))
  .catch((error) => console.log("MongoDB connection failed: ", error.message));

// Socket.io Logic
let onlineUsers = [];

io.on('connection', (socket) => {
  console.log("new connection", socket.id);

  // listen for user connection
  socket.on("addNewUser", (userId) => {
    // Check if the userId is valid
    if (!userId) {
      console.log("Invalid userId received");
      return;
    }
    
    // Remove any existing socket for this user to prevent duplicates
    onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
    
    // Add new user socket
    onlineUsers.push({ userId, socketId: socket.id });
    console.log("onlineUsers", onlineUsers);
    
    io.emit("getOnlineUsers", onlineUsers);
  });

  // add new message
  socket.on("sendMessage", (message) => {
    // Validate message object
    if (!message || !message.recipientId || !message.senderId) {
      console.log("Invalid message format", message);
      return;
    }
    
    const user = onlineUsers.find((user) => user.userId === message.recipientId);
    
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    } else {
      console.log(`User ${message.recipientId} is not online`);
    }
  });
  
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("user disconnected", socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Export for potential use in other files
module.exports = { io, server };