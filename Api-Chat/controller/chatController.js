const Message = require("../model/chatModel");

let io; // Variable para almacenar la instancia de Socket.IO

// Inyectamos la instancia de io desde server.js
const setSocketIOInstance = (ioInstance) => {
  io = ioInstance;
};

// Obtener mensajes de una sala
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort("createdAt");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener mensajes", error });
  }
};

// Enviar un mensaje a una sala
const sendMessage = async (req, res) => {
  try {
    const { roomId, message } = req.body;
    const user = req.user; // Se obtiene del middleware de autenticación

    if (!user) {
      return res.status(401).json({ msg: "Usuario no autenticado" });
    }

    const newMessage = new Message({ roomId, userId: user.id, message });
    await newMessage.save();

    // Emitir el mensaje a todos los sockets conectados a la sala
    if (io) {
      io.to(roomId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ msg: "Error al enviar el mensaje", error });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  setSocketIOInstance
};
