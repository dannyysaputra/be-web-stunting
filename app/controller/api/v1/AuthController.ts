import { Request, Response } from "express";
import { UserService } from "../../../services/UserService";
import { UserType } from "../../../models/UserModel";

const userService = new UserService();

export class AuthController {
    public static async register(req: Request, res: Response): Promise<Response> {
        const { name, email, handphone_number, password }: UserType = req.body;
        const file = req.file;

        if (!name || !email || !handphone_number || !password) {
            return res.status(400).json({
                status: "Failed",
                message: "Please provide a valid input"
            })
        }

        const user = await userService.findUserByEmail(email);

        if (user) {
            return res.status(400).json({
                status: "Failed",
                message: "Email already exists"
            })
        }

        if (password.length < 12) {
            return res.status(400).json({
                status: "Failed",
                message: "Password must be at least 12 characters"
            })
        }

        try {
            const user = await userService.registerUser({ name, email, handphone_number, password });

            return res.status(201).json({
                status: "Success",
                message: "User successfully registered",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    handphoneNumber: user.handphone_number,
                    roleId: user.role_id,
                    createdAt: user.created_at,
                    updatedAt: user.updated_at,
                }
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}