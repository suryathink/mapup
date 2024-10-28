import { Server } from "socket.io";

module.exports = (io: Server) => {
  io.on("connection", (socket) => {
    socket.on("error", () => {
      console.log("Caught error in the socket error handler");
    });
  });

  const mainNameSpace = io.of("/");
  mainNameSpace.on("connection", (socket) => {
    socket.emit("health", {
      msg: "Socket is connected to mainNameSpace",
    });
  });
  require("./dataController")(io);
};
