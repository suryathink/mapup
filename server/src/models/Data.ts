import mongoose, { Document, Schema } from "mongoose";

interface IWeather extends Document {
  time: string; // Unique timestamp for each reading
  temperature: string;
  latitude: string;
  longitude: string;
  elevation: string;
  utcOffset: string;
  timezone: string;
  timezoneAbbreviation: string;
}

const weatherSchema = new Schema<IWeather>(
  {
    time: { type: String, required: true, unique: true },
    temperature: { type: String, required: false },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    elevation: { type: String, required: true },
    utcOffset: { type: String, required: true },
    timezone: { type: String, required: true },
    timezoneAbbreviation: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Weather = mongoose.model<IWeather>("Weather", weatherSchema);

export default Weather;
