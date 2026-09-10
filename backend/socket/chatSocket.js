const jwt = require("jsonwebtoken");
const Message = require("../models/Message");

const initChatSocket = (io) => {
  // Authenticate socket connections using JWT (sent from client as socket.handshake.auth.token)
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication error: no token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.userId}`);

    // Join a group's chat room
    socket.on("joinGroup", (groupId) => {
      socket.join(groupId);
      console.log(`User ${socket.userId} joined group ${groupId}`);
    });

    // Leave a group's chat room
    socket.on("leaveGroup", (groupId) => {
      socket.leave(groupId);
    });

    // Handle sending a message
    socket.on("sendMessage", async ({ groupId, text }) => {
      try {
        if (!groupId || !text) return;

        const message = await Message.create({
          group: groupId,
          sender: socket.userId,
          text,
        });

        const populatedMessage = await message.populate("sender", "name email");

        // Broadcast to everyone in the group room (including sender)
        io.to(groupId).emit("newMessage", populatedMessage);
      } catch (error) {
        socket.emit("errorMessage", { message: "Failed to send message" });
      }
    });

    // Typing indicator
    socket.on("typing", ({ groupId, userName }) => {
      socket.to(groupId).emit("userTyping", { userName });
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });
  });
};

module.exports = initChatSocket;
