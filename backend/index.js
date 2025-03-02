const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Dynamic room data storage
const rooms = {};
const userSocketMap = {}; // Maps socket IDs to room names and usernames

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle room creation
  socket.on("createRoom", ({ username, roomName, password }) => {
    if (!rooms[roomName]) {
      rooms[roomName] = { password, users: [username] };
      userSocketMap[socket.id] = { roomName, username };
      socket.join(roomName);
      socket.emit("room_success", `Room ${roomName} created successfully.`);
      console.log(`Room ${roomName} created by ${username}.`);
    } else {
      socket.emit("room_error", "Room name already exists.");
      console.log(`Failed to create room ${roomName}, already exists.`);
    }
  });

  // Handle joining a room
  socket.on("join_room", ({ formType, username, roomName, password }) => {
    if (rooms[roomName]) {
      if (formType === "create" && rooms[roomName].password !== password) {
        socket.emit("room_error", "Incorrect password.");
      } else if (formType === "join" && rooms[roomName].password === password) {
        socket.join(roomName);
        if (!rooms[roomName].users.includes(username)) {
          rooms[roomName].users.push(username);
        }
        userSocketMap[socket.id] = { roomName, username };
        socket.emit("room_success", `Welcome ${username} to room ${roomName}!`);
        socket.to(roomName).emit("receive_message", {
          username: "System",
          message: `${username} has joined the room.`,
        });
        console.log(`${username} joined room ${roomName}`);
      } else {
        socket.emit("room_error", "Invalid room name or password.");
      }
    } else {
      socket.emit("room_error", "Room does not exist.");
    }
  });

  // Handle sending messages
  socket.on("send_message", ({ roomName, username, message }) => {
    const messageData = { username, message };
    socket.to(roomName).emit("receive_message", messageData);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    const userData = userSocketMap[socket.id];
    if (userData) {
      const { roomName, username } = userData;
      if (rooms[roomName]) {
        rooms[roomName].users = rooms[roomName].users.filter(
          (user) => user !== username
        );
        socket.to(roomName).emit("receive_message", {
          username: "System",
          message: `${username} has left the room.`,
        });
        if (rooms[roomName].users.length === 0) {
          delete rooms[roomName];
          console.log(`Room ${roomName} deleted as all users left.`);
        }
      }
      delete userSocketMap[socket.id];
    }
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
