import { Router } from "express";
import { AuthController } from "../app/controller/api/v1/AuthController";
import upload from "../app/middlewares/multer";

const router = Router();

router.post("/register", upload.single('image'), AuthController.register);
router.post("/login", AuthController.login);

export default router;