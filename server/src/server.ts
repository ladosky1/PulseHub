import dns from "node:dns"
dns.setDefaultResultOrder("ipv4first");
import http from "http";
import { Server } from "socket.io";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { setIO } from "./sockets/index.js";
import { socketAuthMiddleware } from "./sockets/middleware/socketAuth.js";
import app from "./app.js";
import { corsOptions } from "./config/cors.js";
import { handleConnection } from "./sockets/handlers/connection.handler.js";

const server = http.createServer(app);

const io = new Server(server, {
    cors: corsOptions,
});

setIO(io);

io.use(socketAuthMiddleware);

io.on("connection", handleConnection);

async function startServer(){
    await connectDB();

    server.listen(Number(env.PORT), () => {
        console.log(`🚀 PulseHub server running on port ${env.PORT}`)
    });
}

startServer();
