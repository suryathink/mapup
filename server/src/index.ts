import express from "express";
import log4js, { Configuration } from "log4js";
import cors from "cors";
import connectDatabase from "./config/db";
import log4jsConfig from "./config/log4js.config";
import { logRequests } from "./middlewares/requestLogger";
import router from "./routes/route";
import { globalLimiterMiddleware } from "./middlewares/rateLimiter";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(logRequests);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options("*", cors());

app.use(globalLimiterMiddleware);
app.use(router);

log4js.configure(log4jsConfig as Configuration);
const logger = log4js.getLogger();

connectDatabase().then(() => {
  app.listen(PORT, () =>
    logger.log(`Server listening on http://localhost:${PORT}`)
  );
});
