import User from "../models/userModel.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("identity", async ({ userId }) => {
      try {
        await User.findByIdAndUpdate(
          userId,
          {
            socketId: socket.id,
            isOnline: true,
          },
          { new: true }
        );
        console.log("User connected:", userId, "Socket:", socket.id);
      } catch (error) {
        console.log("Identity error:", error);
      }
    });

    // When user disconnects
    socket.on("disconnect", async () => {
      try {
        await User.findOneAndUpdate(
          { socketId: socket.id }, 
          {
            socketId: null,
            isOnline: false,
          }
        );
        console.log("User disconnected:", socket.id);
      } catch (error) {
        console.log("Disconnect error:", error);
      }
    });
  });
};
