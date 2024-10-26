// src/routes/upload.ts
import express, { Request, Response } from "express";
import multer from "multer";
import dataProcessingQueue from "../queues/dataProcessingQueue";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  const filePath = req.file?.path;
  if (filePath) {
    dataProcessingQueue.add({ filePath });
    res.json({ message: "File uploaded and processing started" });
  } else {
    res.status(400).json({ message: "No file uploaded" });
  }
});

export default router;
