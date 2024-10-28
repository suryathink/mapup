import csv from "csv-parser";
import fs from "fs";
import log4js from "log4js";
import { insertDataInBatches } from "./database";

const logger = log4js.getLogger();

export const processCSV = async (filePath: string) => {
  const rows: any[] = [];
  const batchSize = 50;

  // Stream the CSV file
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      if (data) {
        rows.push(data);
      }

      if (rows.length === batchSize) {
        insertDataInBatches(rows.slice());
        rows.length = 0;
      }
    })
    .on("end", async () => {
      if (rows.length) {
        await insertDataInBatches(rows);
      }
      logger.log("CSV file successfully processed");

      fs.unlink(filePath, (err) => {
        if (err) {
          logger.error(`Error deleting file: ${filePath}`, err);
        } else {
          logger.info(`File deleted: ${filePath}`);
        }
      });
    })
    .on("error", (error) => {
      logger.error("Error processing CSV:", error);
    });
};
