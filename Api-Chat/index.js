require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { connectDB } = require("./data/config");
const chatRoutes = require("./routes/chatRoutes");  // Ruta de chat
const verifyToken = require("./middleware/authMiddleware");
const Message = require("./model/chatModel");
const PORT = 5002;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);  // Registrando las rutas de chat

// WebSockets
io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`🔹 Usuario ${socket.id} se unió a la sala ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Server running in http://192.168.70.85:" + PORT);
});
