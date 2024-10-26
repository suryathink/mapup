// src/utils/csvProcessor.ts
import csv from "csv-parser";
import fs from "fs";
import { insertDataInBatches } from "./database";
import log4js from "log4js";

const logger = log4js.getLogger();

export const processCSV = async (filePath: string) => {
  const rows: any[] = []; // Temporary storage for each batch of data
  const batchSize = 100; // Number of records to process in each batch

  // Stream the CSV file
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      console.log("data", JSON.stringify(data));

      if (data) {
        rows.push(data);
      }

      // If the rows array reaches the batch size, insert it into the database
      if (rows.length === batchSize) {
        insertDataInBatches(rows.slice());
        rows.length = 0; // Clear the batch after insertion
      }
    })
    .on("end", async () => {
      // Insert any remaining records if they didn't complete a full batch
      if (rows.length) {
        await insertDataInBatches(rows);
      }
      logger.log("CSV file successfully processed");

      // Delete the CSV file after processing
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
