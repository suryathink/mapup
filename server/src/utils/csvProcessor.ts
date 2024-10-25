// src/utils/csvProcessor.ts
import csv from "csv-parser";
import fs from "fs";
import { insertDataInBatches } from "./database";

export const processCSV = async (filePath: string) => {
  const rows: any[] = []; // Temporary storage for each batch of data
  const batchSize = 1000; // Number of records to process in each batch

  // Stream the CSV file
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      rows.push(data);

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
      console.log("CSV file successfully processed");
    })
    .on("error", (error) => {
      console.error("Error processing CSV:", error);
    });
};
