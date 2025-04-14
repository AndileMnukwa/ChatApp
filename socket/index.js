const { Server } = require('socket.io');
const http = require('http');

// Create an HTTP server
const server = http.createServer();

// Create Socket.io server with proper CORS settings
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

let onlineUsers = [];

io.on('connection', (socket) => {
    console.log("new connection", socket.id);

    // listen for user connection
    socket.on("addNewUser", (userId) => {
        !onlineUsers.some((user) => user.userId === userId) && 
            onlineUsers.push({ userId, socketId: socket.id });
            console.log("onlineUsers", onlineUsers);

            io.emit("getOnlineUsers", onlineUsers);
    });

    //add new message
    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find((user) => user.userId === message.recipientId);
        
        if (user) {
            socket.to(user.socketId).emit("getMessage", message);
        }
    });
    
    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        console.log("user disconnected", socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });
});

// Listen on port 3000
server.listen(3000, () => {
    console.log("Socket.io server is running on port 3000");
});