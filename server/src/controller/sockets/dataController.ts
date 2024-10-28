import { Server, Socket } from "socket.io";

interface ExtendedSocket extends Socket {
  heartbeatIntervalId?: NodeJS.Timeout;
}

module.exports = (io: Server) => {
  const dataNameSpace = io.of("/data");
  dataNameSpace.on("connection", async (socket: ExtendedSocket) => {
    socket.emit("connected", "Welcome to the server. data namespace");
    socket.on("health", (e: any) => console.log(e));
  });
};
