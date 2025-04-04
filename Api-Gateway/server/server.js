const cors = require("cors");
const express = require("express");
const logger = require("../middlewares/logger");
const gatewatRoutes = require("../routes/gateway.routes")

class Server {
    constructor(port){
        this.app = express();
        this.port = port;
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.app.use(cors());
        this.app.use(logger);
    }
    routes(){
        this.app.use(gatewatRoutes);
    }
    start(){
        this.app.listen(this.port,()=>
        console.log("Gateway corriendo en http://localhost:" + this.port));
    }
}

module.exports = Server;