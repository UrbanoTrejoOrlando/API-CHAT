require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { connectDB } = require("./data/config");
const chatRoutes = require("./routes/chatRoutes");
const chatController = require("./controller/chatController"); // Importa el controlador para inyectar io
const PORT = 5002;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Inyectamos la instancia de io al controlador
chatController.setSocketIOInstance(io);

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes); // Rutas del chat

// WebSocket
io.on("connection", (socket) => {
  console.log(" Usuario conectado:", socket.id);

  // El usuario se une a una sala específica
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Usuario ${socket.id} se unió a la sala ${roomId}`);
  });

  // Usuario se desconecta
  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://192.168.8.99:${PORT}`);
});
