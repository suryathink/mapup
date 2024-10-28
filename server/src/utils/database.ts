import log4js from "log4js";
import Weather from "../models/Data";
import { WeatherService } from "../services/weather.service";

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
    const result = await Weather.bulkWrite(bulkOps);

    const createdIds = result.upsertedIds
      ? Object.values(result.upsertedIds).map((upsert) => upsert._id.toString())
      : [];

    if (createdIds && createdIds.length) {
      const createdData = await WeatherService.fetchNewlyCreatedData(
        createdIds
      );
      // todo emit this via socket
      logger.log("createdData", JSON.stringify(createdData));
    }

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
