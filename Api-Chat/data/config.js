const mongoose = require("mongoose");
const connectDB = async()=>{
    const URL = "mongodb://chat:chat4321@localhost:27027/";
    try {
        await mongoose.connect(URL);
        console.log("Database Running");
        
        }catch(error){
            console.error("Cant connect to database");
            console.error(error);

    }
    
}
module.exports = {connectDB};