const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/salaMiddleware");
const { createRoom, getAllRooms, getRoomById, deleteRoom,joinRoom } = require("../controller/salaController");

// Crear una sala (requiere autenticación)
router.post("/rooms", verifyToken, createRoom);

// Obtener todas las salas
router.get("/rooms", getAllRooms);

// Obtener una sala por ID
router.get("/rooms/:id", getRoomById);

// Unirse a una sala (requiere autenticación)
router.post("/rooms/:roomId/join", verifyToken, joinRoom);

// Eliminar una sala por ID (requiere autenticación)
router.delete("/rooms/:id", verifyToken, deleteRoom);

module.exports = router;
