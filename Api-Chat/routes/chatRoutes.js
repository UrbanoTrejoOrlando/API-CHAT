const express = require("express");
const { getMessages, sendMessage } = require("../controller/chatController");
const verifyToken = require("../middleware/authMiddleware"); 

const router = express.Router();

// Obtener mensajes previos de una sala
router.get("/:roomId", getMessages);

// Ruta para enviar un mensaje a una sala
router.post("/sendMessage", verifyToken, sendMessage);

module.exports = router;
