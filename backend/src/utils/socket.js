export const socketHandler=async(io)=>{
    io.on("connection",(socket)=>{
        const userId = socket.handshake.query.userId;
        console.log(socket.id, "______________________",userId);
    })
}