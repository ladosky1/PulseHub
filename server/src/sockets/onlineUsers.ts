const onlineUsers = new Map<string, Set<string>>();

export function addOnlineUser(userId: string, socketId: string){
    const sockets = onlineUsers.get(userId);

    if(sockets){
        sockets.add(socketId);

        return false;
    } else {
        onlineUsers.set(
            userId,
            new Set([socketId])
        )
    }

    return true;
};

export function removeOnlineUser(userId: string, socketId: string){
    const sockets = onlineUsers.get(userId);

    if(!sockets){
        return;
    }

    sockets.delete(socketId);

    if(sockets.size === 0){
        onlineUsers.delete(userId);
    }
};

export function isUserOnline(userId: string){
    return onlineUsers.has(userId);
};

export function getSocketId(userId: string){
    return onlineUsers.get(userId);
};

export function getOnlineUsers(){
    return [...onlineUsers.keys()];
}



