import { Router } from "express";
import { AuthController } from "../app/controller/api/v1/AuthController";
import upload from "../app/middlewares/multer";

const router = Router();

router.post("/register", upload.single('image'), AuthController.register);
router.post("/login", AuthController.login);
router.post("/google", AuthController.googleAuth);
router.post("/google/refresh", AuthController.googleAuthRefresh);

export default router;