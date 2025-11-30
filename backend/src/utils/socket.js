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
    socket.on("updateLocation",async({latitude, longitude, userId})=>{
      try {
        const user=await User.findByIdAndUpdate(userId,{
          location:{
            type:"Point",
            coordinates:[latitude,longitude]
          },
          isOnline:true,
          socketId:socket.id
        })
        if(user){
          io.emit("updateDeliveredLocation",{
            deliveryBoyId:userId,
            latitude,
            longitude
          })
        }
      } catch (error) {
        console.log(error)
      }
    })

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
