import express from "express";
import http from "http";
import log4js, { Configuration } from "log4js";
import cors from "cors";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import connectDatabase from "./config/db";
import log4jsConfig from "./config/log4js.config";
import { logRequests } from "./middlewares/requestLogger";
import router from "./routes/route";
import { globalLimiterMiddleware } from "./middlewares/rateLimiter";

log4js.configure(log4jsConfig as Configuration);
const app = express();
const PORT = process.env.PORT || 8000;

app.use(logRequests);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options("*", cors());

app.use(globalLimiterMiddleware);

app.use(router);
const server = http.createServer(app);

export const io = new Server(server, {
  serveClient: false,
  path: "/ws",
  cors: {
    methods: ["GET", "POST"],
    origin: "*",
    credentials: true,
  },
});
instrument(io, {
  auth: false,
});
require("./controller/sockets")(io);

const logger = log4js.getLogger();

connectDatabase().then(() => {
  server.listen(PORT, () =>
    logger.log(`Server listening on http://localhost:${PORT}`)
  );
});
