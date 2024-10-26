import { logApiError } from "../utils/errorLogger";
import express, { Request, Response } from "express";
import multer from "multer";
import dataProcessingQueue from "../queues/dataProcessingQueue";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

export class UploadController {
  public static async upload(req: Request, res: Response) {
    try {
      const filePath = req.file?.path;
      if (filePath) {
        dataProcessingQueue.add({ filePath });
        res.json({ message: "File uploaded and processing started" });
      } else {
        res.status(400).json({ message: "No file uploaded" });
      }
    } catch (error: any) {
      logApiError(req, error);
      return res.status(500).send({
        statusCode: 500,
        message: "internal server error",
      });
    }
  }
}
