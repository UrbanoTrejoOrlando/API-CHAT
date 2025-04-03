const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const roomRoutes = require('./routes/salaRoutes');
const {connectDB} = require('./data/config');
require('dotenv').config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
const PORT = 5000;


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api', roomRoutes);

connectDB();


// Configuración del servidor
app.listen(PORT,()=>{
    console.log("Server running in http://localhost:"+PORT)
});
