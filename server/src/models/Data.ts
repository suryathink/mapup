// src/models/Weather.ts

import mongoose, { Document, Schema } from "mongoose";

interface IWeather extends Document {
  time: string; // Unique timestamp for each reading
  temperature: number;
  latitude: number;
  longitude: number;
  elevation: number;
  utcOffset: number;
  timezone: string;
  timezoneAbbreviation: string;
}

const weatherSchema = new Schema<IWeather>({
  time: { type: String, required: true, unique: true },
  temperature: { type: Number, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  elevation: { type: Number, required: true },
  utcOffset: { type: Number, required: true },
  timezone: { type: String, required: true },
  timezoneAbbreviation: { type: String, required: true },
});

const Weather = mongoose.model<IWeather>("Weather", weatherSchema);

export default Weather;
