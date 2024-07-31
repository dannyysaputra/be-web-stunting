import { Router } from "express";
import { ArticleController } from "../app/controller/api/v1/ArticleController";
import upload from "../app/middlewares/multer";
import { authorize, checkAccess } from "../app/middlewares/authorize";

const router = Router();

router.post("/", authorize, checkAccess(['admin']), upload.single('poster'), ArticleController.create);
router.get("/", ArticleController.getArticles);
router.get("/:title", ArticleController.getArticles);
router.put("/:id", authorize, checkAccess(['admin']), upload.single('poster'), ArticleController.update);
router.delete("/:id", authorize, checkAccess(['admin']), ArticleController.delete);

export default router;