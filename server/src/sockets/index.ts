import { Server } from "socket.io";

let io: Server | null = null;

export function setIO(socketServer: Server){
    io = socketServer;
};

export function getIO(){
    if(!io){
        throw new Error("Socket.io has not been initialized");
    }
    
    return io;
}