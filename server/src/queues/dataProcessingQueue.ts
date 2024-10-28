import Bull from "bull";
import { processCSV } from "../utils/csvProcessor";

const dataProcessingQueue = new Bull("data-processing", {
  redis: {
    host: process.env.REDIS_HOST_URL!.toString(),
    port: Number(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD!,
  },
});

dataProcessingQueue.process(async (job) => {
  await processCSV(job.data.filePath);
});

export default dataProcessingQueue;
