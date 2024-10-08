import { Request, Response } from "express";
import { UserService } from "../../../services/UserService";
import { UserType } from "../../../models/UserModel";
import { uploadToCloudinary } from "../../../utils/uploadCloudinary";
import { OAuth2Client, UserRefreshClient } from "google-auth-library";
import { createToken } from "../../../utils/encrypt";

const { CLIENT_ID, CLIENT_SECRET } = process.env;

const userService = new UserService();

const oAuth2Client = new OAuth2Client(
    CLIENT_ID,
    CLIENT_SECRET,
    'postmessage'
)

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

            let avatarUrl;
            if (req.file) {
                const image = await uploadToCloudinary(req.file?.buffer, req.file?.mimetype, 'choco/avatar');

                avatarUrl = image.secure_url;
            }

            const user = await userService.registerUser({ 
                name, 
                email, 
                handphone_number, 
                avatar: avatarUrl, 
                password,
                role_id: 1,                
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

    public static async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            const user = await userService.findUserByEmail(email);

            if (!user) {
                return res.status(404).json({
                    status: "Failed",
                    message: "Email not found"
                });
            }

            const isPasswordCorrect = await userService.verifyPassword(user.password as string, password);

            if (!isPasswordCorrect) {
                return res.status(401).json({ status: "Failed", message: "Wrong password" });
            }

            const token = await userService.generateToken(user);

            return res.status(200).json({
                status: "Success",
                message: "Login successful",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    handphoneNumber: user.handphone_number,
                    avatar: user.avatar,
                    token,
                    role_id: user.role_id,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                }
            })
        } catch (error) {
            return res.status(500).json({ status: "Failed", message: "Internal server error" })
        }
    }

    public static async getCurrentUser(req: Request, res: Response): Promise<Response> {
        try {
            // Assume that the token is passed in the Authorization header
            const authHeader = req.headers.authorization;
    
            if (!authHeader) {
                return res.status(401).json({
                    status: "Failed",
                    message: "No token provided"
                });
            }
    
            // Extract the token from the header
            const token = authHeader.split(' ')[1];
    
            // Verify and decode the token
            const decodedUser = await userService.verifyToken(token);
    
            if (!decodedUser) {
                return res.status(401).json({
                    status: "Failed",
                    message: "Invalid or expired token"
                });
            }
    
            // Find the user based on the ID from the decoded token
            const user = await userService.findUserById(decodedUser.id);
    
            if (!user) {
                return res.status(404).json({
                    status: "Failed",
                    message: "User not found"
                });
            }
    
            return res.status(200).json({
                status: "Success",
                message: "User data retrieved successfully",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    handphoneNumber: user.handphone_number,
                    avatar: user.avatar,
                    role_id: user.role_id,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                }
            });
        } catch (error) {
            console.error("Internal Error", error);
            return res.status(500).json({
                status: "Failed",
                message: "Internal server error"
            });
        }
    }
    

    public static async googleAuth(req: Request, res: Response) {
        const { tokens } = await oAuth2Client.getToken(req.body.code);
        const credentials = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token!,
            audience: CLIENT_ID
        })
        const payload = credentials.getPayload();

        const user = await userService.findUserByEmail(payload?.email as string);

        if (user) {
            if (!user.google_id) {
                await userService.googleId(user, payload?.sub as string);
            }

            const token = await createToken({
                id: user.id,
                email: user.email,
                role_id: user.role_id,
                created_at: user.created_at,
                updated_at: user.updated_at,
            })

            return res.status(201).json({
                status: "Success",
                message: "Google login success",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    handphoneNumber: user.handphone_number,
                    avatar: user.avatar,
                    token,
                    role_id: user.role_id,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                }
            })
        }

        try {
            const user = await userService.registerUser({
                name: payload?.name,
                email: payload?.email,
                handphone_number: "0",
                avatar: payload?.picture,
                password: null,
                google_id: payload?.sub
            });

            console.log(user);
            
            const token = await createToken({
                id: user.id,
                email: user.email,
                role_id: user.role_id,
                created_at: user.created_at,
                updated_at: user.updated_at,
            })

            return res.status(201).json({
                status: "Success",
                message: "Google register success",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    handphoneNumber: user.handphone_number,
                    avatar: user.avatar,
                    token,
                    role_id: user.role_id,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                }
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "Failed", message: "Internal server error" })
        }
    }

    public static async googleAuthRefresh(req: Request, res: Response) {
        const user = new UserRefreshClient(
            CLIENT_ID,
            CLIENT_SECRET,
            req.body.refreshToken,
        )

        const { credentials } = await user.refreshAccessToken();
        res.json(credentials);
    }
}