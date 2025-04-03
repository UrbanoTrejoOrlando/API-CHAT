const express = require("express");
const { register, login, getAllUsers, getUserById, deleteUser, protectedRoute } = require("../controller/userController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers);  
router.get("/users/:id", getUserById);  
router.delete("/users/:id", deleteUser);

router.get("/protected", protectedRoute);

module.exports = router;
