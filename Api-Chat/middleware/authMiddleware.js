const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extraemos el token del header

  if (!token) {
    return res.status(401).json({ msg: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificamos el token
    req.user = decoded;  // Ponemos el usuario decodificado en el objeto 'req'
    next();  // Continuamos con el siguiente middleware o controlador
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido" });
  }
};

module.exports = verifyToken;