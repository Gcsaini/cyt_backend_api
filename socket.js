let io;
import { Server } from "socket.io";

export function initServer(httpServer) {
    io = new  Server(httpServer, {
        pingTimeout:60000,
        cors: {
            origin: 'http://localhost:4000',
            methods: ['GET', 'POST'],
            credentials: true,
        }
    });
    return io;
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.io is not initialized');
    }
    return io;
}