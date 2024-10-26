// src/controllers/weatherController.ts

import { Request, Response } from "express";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import Weather from "../models/Data"; // Assuming you have a Weather model defined
import mongoose from "mongoose";
import log4js from "log4js";
const logger = log4js.getLogger();

interface WeatherData {
  time: string;
  temperature: number;
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  utcOffset: number;
  timezoneAbbreviation: string;
}

// API endpoint to process and store CSV data
export const uploadWeatherData = async (req: Request, res: Response) => {
  try {
    if (!req.file?.filename) {
      return res.status(400).json({ message: "filename must be present" });
    }
    const filePath = path.join(__dirname, "../../uploads", req.file.filename); // Path to uploaded CSV

    const bulkOps: mongoose.AnyBulkWriteOperation<WeatherData>[] = [];

    // Stream and parse CSV data
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const record: WeatherData = {
          time: row["time"],
          temperature: parseFloat(row["temperature_2m (°C)"]),
          latitude: parseFloat(row["latitude"]),
          longitude: parseFloat(row["longitude"]),
          elevation: parseFloat(row["elevation"]),
          utcOffset: parseInt(row["utc_offset_seconds"]),
          timezone: row["timezone"],
          timezoneAbbreviation: row["timezone_abbreviation"],
        };

        bulkOps.push({
          updateOne: {
            filter: { time: record.time }, // Unique identifier for weather record
            update: { $set: record },
            upsert: true, // Insert if not found
          },
        });
      })
      .on("end", async () => {
        try {
          // Perform bulk write in MongoDB
          await Weather.bulkWrite(bulkOps);
          res
            .status(200)
            .json({ message: "Weather data processed successfully" });
        } catch (error) {
          logger.error("Bulk write error:", error);
          res
            .status(500)
            .json({ message: "Error processing weather data", error });
        } finally {
          // Clean up uploaded file
          fs.unlinkSync(filePath);
        }
      })
      .on("error", (error) => {
        logger.error("CSV parsing error:", error);
        res.status(500).json({ message: "Error reading CSV file", error });
      });
  } catch (error) {
    logger.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
