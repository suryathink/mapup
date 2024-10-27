import express, { Request, RequestHandler, Response } from "express";
import multer from "multer";
import dataProcessingQueue from "../queues/dataProcessingQueue";
import { UserController } from "../controller/user.controller";
import verifyToken from "../middlewares/auth";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post(
  "/upload",
  verifyToken(["user", "admin", "manager"]),
  upload.single("file"),
  UserController.upload
);

router.post("/signup", UserController.create);
router.post("/login", UserController.login);

export default router;
