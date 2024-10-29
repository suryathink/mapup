import express from "express";
import multer from "multer";
import { UserController } from "../controller/user.controller";
import { WeatherController } from "../controller/weather.controller";
import verifyToken from "../middlewares/auth";
import {
  authLimiterMiddleware,
  apiLimiterMiddleware,
} from "../middlewares/rateLimiter";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post(
  "/upload",
  apiLimiterMiddleware,
  verifyToken(["user", "admin", "manager"]),
  upload.single("file"),
  UserController.upload
);

router.post("/signup", authLimiterMiddleware, UserController.create);
router.post("/login", authLimiterMiddleware, UserController.login);

router.get(
  "/",
  apiLimiterMiddleware,
  verifyToken(["admin", "user", "manager"]),
  WeatherController.fetchAll
);

router.get("/hello", apiLimiterMiddleware, UserController.hello);
router.put(
  "/:id",
  apiLimiterMiddleware,
  verifyToken(["admin"]),
  WeatherController.update
);
router.delete(
  "/:id",
  apiLimiterMiddleware,
  verifyToken(["admin"]),
  WeatherController.delete
);

export default router;
