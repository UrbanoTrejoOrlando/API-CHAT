const Message = require("../model/chatModel");
const verifyToken = require("../middleware/authMiddleware");
const io = require("socket.io");

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort("createdAt");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener mensajes", error });
  }
};

// Función para enviar un mensaje a una sala
exports.sendMessage = async (req, res) => {
  try {
    const { roomId, message } = req.body;  // Obtenemos roomId y message del cuerpo de la solicitud
    const user = req.user;  // Extraemos el usuario del middleware

    if (!user) {
      return res.status(401).json({ msg: "Usuario no autenticado" });
    }

    // Creamos un nuevo mensaje con el userId del token
    const newMessage = new Message({ roomId, userId: user.id, message });
    await newMessage.save();

    res.status(201).json(newMessage);  // Respondemos con el mensaje creado
  } catch (error) {
    res.status(500).json({ msg: "Error al enviar el mensaje", error });
  }
};
