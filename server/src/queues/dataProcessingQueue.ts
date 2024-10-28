import Bull from "bull";
import log4js from "log4js";
import { processCSV } from "../utils/csvProcessor";

const logger = log4js.getLogger();

const dataProcessingQueue = new Bull("data-processing", {
  redis: {
    host: process.env.REDIS_HOST_URL!.toString(),
    port: Number(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD!,
  },
});

dataProcessingQueue.on("ready", () => {
  logger.log("Successfully connected to Redis for data processing queue.");
});

dataProcessingQueue.on("error", (error) => {
  logger.error("Failed to connect to Redis:", error);
});

dataProcessingQueue.process(async (job) => {
  await processCSV(job.data.filePath);
});

export default dataProcessingQueue;
