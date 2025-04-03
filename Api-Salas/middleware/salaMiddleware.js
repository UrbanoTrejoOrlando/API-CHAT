const jwt = require('jsonwebtoken');
const axios = require('axios');

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'Acceso no autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Verificación adicional con la API de autenticación (si es necesario)
    try {
      const response = await axios.get(`http://localhost:4000/api/auth/users/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Si no se encuentra el usuario, o el token es inválido en la API de autenticación
      if (!response.data) {
        return res.status(401).json({ msg: 'Usuario no autenticado' });
      }

      // Si la verificación es exitosa, continuamos
      next();
    } catch (error) {
      return res.status(401).json({ msg: 'Token inválido o error al verificar usuario' });
    }
  } catch (error) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};

module.exports = verifyToken;
