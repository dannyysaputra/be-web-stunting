import { Router } from "express";
import { AnthropometryController } from "../app/controller/api/v1/AnthropometryController";
import { authorize } from "../app/middlewares/authorize";

const router = Router();

router.post("/", authorize, AnthropometryController.create);
router.get("/", authorize, AnthropometryController.getAnthropometries);
// router.get("/:title", AnthropometryController.getArticles);
router.put("/:id", authorize, AnthropometryController.update);
router.delete("/:id", authorize, AnthropometryController.delete);

export default router;