import { Router } from "express";
import { AuthController } from "../app/controller/api/v1/AuthController";
import upload from "../app/middlewares/multer";
import swaggerui from 'swagger-ui-express';
import swaggerDocument from '../openapi.json'; 

const router = Router();

router.post("/register", upload.single('image'), AuthController.register);

router.use('/api-docs', swaggerui.serve);
router.get('/api-docs', swaggerui.setup(swaggerDocument));
router.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
})

export default router;