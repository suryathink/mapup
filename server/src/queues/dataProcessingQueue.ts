// src/queues/dataProcessingQueue.ts
import Bull from "bull";
import { processCSV } from "../utils/csvProcessor";

const dataProcessingQueue = new Bull("data-processing", {
  redis: { host: "127.0.0.1", port: 6379 },
});

dataProcessingQueue.process(async (job) => {
  await processCSV(job.data.filePath);
});

export default dataProcessingQueue;
