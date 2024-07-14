import { Router } from "express";
import { AuthController } from "../app/controller/api/v1/AuthController";

export const router = Router();

router.post("/register", AuthController.register);