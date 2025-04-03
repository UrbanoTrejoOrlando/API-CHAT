const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "El usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ msg: "Error en el servidor", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Credenciales inválidas" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Credenciales inválidas" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Obtener todos los usuarios (sin token)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Excluye la contraseña
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Obtener un usuario por ID (sin token)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Eliminar un usuario por ID (sin token)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    await user.deleteOne();
    res.json({ msg: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

exports.protectedRoute = (req, res) => {
  try {
    // Verifica si el token está presente en los headers de la solicitud
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ msg: "No hay token, autorización denegada" });
    }

    // Verifica el token con el secreto
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Si el token es válido, el id del usuario decodificado se adjunta a req.user
    req.user = decoded.id;

    // Puedes enviar alguna respuesta si el token es válido
    res.json({ msg: "Acceso permitido", userId: req.user });
  } catch (err) {
    res.status(401).json({ msg: "Token no válido" });
  }
};