// src/utils/database.ts
import mongoose from "mongoose";
import log4js from "log4js";
import { Data } from "../models/Data";

const logger = log4js.getLogger();

// Function to insert data in batches to avoid memory overload
export const insertDataInBatches = async (dataBatch: any[]) => {
  try {
    // Inserting batch of data database
    await Data.insertMany(dataBatch, { ordered: false });
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
  return await Data.find(filter).skip(skip).limit(limit);
};
