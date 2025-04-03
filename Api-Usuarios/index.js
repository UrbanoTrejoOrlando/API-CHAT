const express = require("express");
const dotenv = require("dotenv");
const {connectDB} = require("./data/config");
const authRoutes = require("./routes/userRoutes");
const cors = require("cors");
const PORT = 4000;

dotenv.config();

connectDB();

console.log("JWT_SECRET:", process.env.JWT_SECRET);
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT,()=>{
    console.log("Server running in http://localhost:"+PORT)
});