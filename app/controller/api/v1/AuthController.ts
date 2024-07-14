import { Request, Response } from "express";
import { UserService } from "../../../services/UserService";
import { UserType } from "../../../models/UserModel";
import { uploadToCloudinary } from "../../../utils/uploadCloudinary";

const userService = new UserService();

export class AuthController {
    public static async register(req: Request, res: Response): Promise<Response> {
        try {
            const { name, email, handphone_number, password }: UserType = req.body;

            if (!name || !email || !handphone_number || !password) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Please provide a valid input"
                })
            }

            const userEmail = await userService.findUserByEmail(email);

            if (userEmail) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Email already exists"
                })
            }
            
            if (!req.file) {
                return res.status(400).json({ 
                    status: "Failed",
                    message: 'No Image Uploaded' 
                });
            }

            if (password.length < 12) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Password must be at least 12 characters"
                })
            }

            const image = await uploadToCloudinary(req.file?.buffer, req.file?.mimetype, 'choco/avatar');

            if (!image.secure_url) {
                return res.status(500).json({ status: "Failed", message: 'Cannot retrieve image from Cloudinary' });
            }

            const user = await userService.registerUser({ 
                name, 
                email, 
                handphone_number, 
                avatar: image.secure_url, 
                password 
            });

            return res.status(201).json({
                status: "Success",
                message: "User successfully registered",
                data: user
            });
        } catch (error) {
            console.error("Internal Server Error:", error);
            return res.status(500).json({ 
                status: "Failed", 
                message: 'Internal Server Error',
                error: error
            });
        }
    }
}