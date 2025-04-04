const Server = require("./server/server");
const PORT = process.env.PORT || 5010;

const server = new Server(PORT);
server.start();