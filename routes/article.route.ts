import { Router } from "express";
import { ArticleController } from "../app/controller/api/v1/ArticleController";
import upload from "../app/middlewares/multer";
import { authorize, checkAccess } from "../app/middlewares/authorize";

const router = Router();

router.post("/create", authorize, checkAccess(['admin']), upload.single('poster'), ArticleController.create);
router.get("/article/:title", ArticleController.getArticles);

export default router;