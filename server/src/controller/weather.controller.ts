import { Request, Response } from "express";
import { WeatherService } from "../services/weather.service";
import { logApiError } from "../utils/errorLogger";

export class WeatherController {
  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await WeatherService.delete(id);
      res.send({ message: "data deleted succesfully" });
      return;
    } catch (error) {
      logApiError(req, error as Error);
      res.status(500).send({
        message: "internal server error",
      });
      return;
    }
  }

  public static async fetchAll(req: Request, res: Response): Promise<void> {
    try {
      const { timezone, page = 1, limit = 20, createdAt = "desc" } = req.query;

      const data = await WeatherService.fetchAll({
        timezone: timezone as string,
        page: Number(page) < 1 ? 1 : Number(page),
        limit: Number(limit),
        createdAt: createdAt as "asc" | "desc", // Specify sorting order for createdAt
      });

      res.send({ data });
      return;
    } catch (error) {
      logApiError(req, error as Error);
      res.status(500).send({
        message: "Internal server error",
      });
      return;
    }
  }
  public static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { temperature } = req.body;

      if (!id || !temperature) {
        res
          .status(400)
          .send({ message: "id and temperature are mandatory fields" });
        return;
      }

      const data = await WeatherService.update(id, {
        temperature,
      });

      if (!data) {
        res.status(400).send({ message: "data updation failed", data });
        return;
      }
      res.send({ message: "data updated succesfully", data });
      return;
    } catch (error) {
      logApiError(req, error as Error);
      res.status(500).send({
        message: "internal server error",
      });
      return;
    }
  }
}
