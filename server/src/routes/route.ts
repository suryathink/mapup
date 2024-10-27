import express from "express";
import multer from "multer";
import { UserController } from "../controller/user.controller";
import { WeatherController } from "../controller/weather.controller";
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

router.get(
  "/",
  verifyToken(["admin", "user", "manager"]),
  WeatherController.fetchAll
);
router.put("/:id", verifyToken(["admin"]), WeatherController.update);
router.delete("/:id", verifyToken(["admin"]), WeatherController.delete);

export default router;
