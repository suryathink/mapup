import Weather, { IWeather } from "../models/Data";

interface FetchOptions {
  timezone?: string;
  page?: number;
  limit?: number;
  createdAt?: "asc" | "desc";
}

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

  public static async fetchAll(options: FetchOptions = {}) {
    const { timezone, page = 1, limit = 10, createdAt = "desc" } = options;

    const query: Record<string, any> = {};
    if (timezone) {
      query.timezone = { $regex: timezone, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const sortOrder = createdAt === "asc" ? 1 : -1;

    const data = await Weather.find(query)
      .sort({ createdAt: sortOrder }) // Sort by createdAt according to the provided direction
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await Weather.countDocuments(query);

    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    };
  }

  // fetch on the basis of ids
  public static async fetchNewlyCreatedData(ids: string[]) {
    return await Weather.find({
      _id: { $in: ids },
    }).lean();
  }
}
