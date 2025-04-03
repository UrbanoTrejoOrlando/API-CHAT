const Room = require('../model/salaModel');
const axios = require('axios');

exports.createRoom = async (req, res) => {
  const { name, description } = req.body;
  const createdBy = req.user.id; // El usuario autenticado

  try {
    const newRoom = new Room({
      name,
      description,
      createdBy,
      users: [createdBy], // El creador de la sala es agregado como primer usuario
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear la sala', error });
  }
};

exports.getAllRooms = async (req, res) => {
    try {
      const rooms = await Room.find();
      
      // Obtener detalles de usuarios desde la API de autenticación
      const populatedRooms = await Promise.all(rooms.map(async (room) => {
        try {
          const userResponse = await axios.get(`http://localhost:4000/api/users/${room.createdBy}`);
          const createdByUser = userResponse.data;
          
          return {
            ...room._doc,
            createdBy: createdByUser, // Sustituimos el ID por los datos reales
          };
        } catch (error) {
          return room; // Si falla la API, dejamos solo el ID
        }
      }));
  
      res.json(populatedRooms);
    } catch (error) {
      console.error('Error en getAllRooms:', error);
      res.status(500).json({ msg: 'Error al obtener las salas', error: error.message });
    }
  };

  exports.getRoomById = async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) return res.status(404).json({ msg: 'Sala no encontrada' });
  
      // Obtener los datos del usuario que creó la sala
      const userResponse = await axios.get(`http://localhost:4000/api/auth/users/${room.createdBy}`);
      const createdByUser = userResponse.data;
  
      // Obtener los datos de los usuarios que están en la sala
      const usersResponse = await axios.get(`http://localhost:4000/api/auth/users`, {
        params: { ids: room.users }
      });
      const usersInRoom = usersResponse.data;
  
      res.json({
        ...room._doc,
        createdBy: createdByUser,  // Reemplazar por los datos completos
        users: usersInRoom  // Reemplazar por los datos completos de los usuarios
      });
    } catch (error) {
      console.error('Error en getRoomById:', error);
      res.status(500).json({ msg: 'Error al obtener la sala', error: error.message });
    }
  };
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ msg: 'Sala no encontrada' });

    await room.deleteOne();
    res.json({ msg: 'Sala eliminada' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar la sala', error });
  }
};

exports.joinRoom = async (req, res) => {
    try {
      const { roomId } = req.params;
      const userId = req.user.id; // Usuario autenticado
  
      const room = await Room.findById(roomId);
      if (!room) return res.status(404).json({ msg: "Sala no encontrada" });
  
      // Verificamos si el usuario ya está en la sala
      if (room.users.includes(userId)) {
        return res.status(400).json({ msg: "Ya estás en esta sala" });
      }
  
      room.users.push(userId);
      await room.save();
  
      res.json({ msg: "Te has unido a la sala", room });
    } catch (error) {
      res.status(500).json({ msg: "Error al unirse a la sala", error });
    }
  };
  