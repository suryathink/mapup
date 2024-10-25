import express, { Request, Response } from "express";
import connectDatabase from "./config/db";
import log4js, { Configuration } from "log4js";
import log4jsConfig from "./config/log4js.config";
import { logRequests } from "./middlewares/requestLogger";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(logRequests);

log4js.configure(log4jsConfig as Configuration);
const logger = log4js.getLogger();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

connectDatabase().then(() => {
  app.listen(PORT, () =>
    logger.log(`Server listening on http://localhost:${PORT}`)
  );
});