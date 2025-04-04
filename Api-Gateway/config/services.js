const services = [
    {
        name: "usuarios",
        url: "http://localhost:4000",
        path: "/api-usuarios",
    },
    {
        name: "salas",
        url: "http://localhost:5000",
        path: "/api-salas",
    },
    {
        name: "chat",
        url: "http://localhost:5002",
        path: "/api-chat",
    }
];

module.exports = { services };
