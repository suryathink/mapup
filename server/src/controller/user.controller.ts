import { Request, Response } from "express";
import { logApiError } from "../utils/errorLogger";
import { UserService } from "../services/user.service";
import dataProcessingQueue from "../queues/dataProcessingQueue";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

export class UserController {
  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      // Validate email format using regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).send({
          message: "Invalid email format",
        });
        return;
      }

      if (!name || !email || !password) {
        res.status(400).send({
          message: "Name. email and password are required fields",
        });

        return;
      }

      const response = await UserService.create(name, email, password);
      //   delete response.password;

      if (response && "isError" in response && response.isError) {
        res.status(400).send({
          message: response.message,
        });
        return;
      }

      res.send({ data: response });
    } catch (error) {
      logApiError(req, error as Error);
      res.status(500).send({
        message: "internal server error",
      });
      return;
    }
  }
  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate email format using regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).send({
          message: "Invalid email format",
        });
        return;
      }

      if (!email || !password) {
        res.status(400).send({
          message: "email and password are required fields",
        });
      }

      const response = await UserService.login(email, password);

      if (response && "isError" in response && response.isError) {
        res.status(400).send({
          message: response.message,
        });
        return;
      }

      res.send({ data: response });
      return;
    } catch (error) {
      logApiError(req, error as Error);
      res.status(500).send({
        message: "internal server error",
      });
      return;
    }
  }
  public static async upload(req: Request, res: Response): Promise<void> {
    try {
      const filePath = req.file?.path;
      if (filePath) {
        dataProcessingQueue.add({ filePath });
        res.json({ message: "File uploaded and processing started" });
        return;
      } else {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }
    } catch (error) {
      logApiError(req, error as Error);
      res.status(500).send({
        message: "internal server error",
      });
      return;
    }
  }
}
