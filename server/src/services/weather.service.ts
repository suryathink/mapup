import Weather from "../models/Data";

export class WeatherService {
  public static async delete(id: string) {
    await Weather.findOneAndDelete({ _id: id });
  }

  public static async update(id: string, body: { temperature: string }) {
    return await Weather.findOneAndUpdate(
      { _id: id },
      { ...body },
      { new: true }
    );
  }
}
