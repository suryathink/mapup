import log4js from "log4js";
import Weather from "../models/Data";

const logger = log4js.getLogger();

// Function to insert data in batches to avoid memory overload
export const insertDataInBatches = async (dataBatch: any[]) => {
  try {
    const bulkOps: any = [];

    dataBatch.forEach((record) => {
      if (record.time) {
        // Only add records with a non-null 'time'
        bulkOps.push({
          updateOne: {
            filter: { time: record.time },
            update: { $set: record },
            upsert: true, // Insert if not exists, otherwise update
          },
        });
      }
    });

    await Weather.bulkWrite(bulkOps);
    logger.log("Batch insert successful!");
  } catch (error) {
    logger.error("Error inserting batch:", error);
  }
};

// Function to paginate and filter data for API responses
export const getPaginatedData = async (
  filter: any,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;
  return await Weather.find(filter).skip(skip).limit(limit);
};
