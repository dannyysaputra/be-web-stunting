import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel";
import { RoleRepository } from "../repositories/RoleRepository";

const roleRepository = new RoleRepository();

export async function authorize(req: any, res: Response, next: NextFunction) {
    try {
        const bearerToken = req.headers.authorization;
        const token = bearerToken.split('Bearer ')[1];
        const tokenPayload = jwt.verify(token, 'RAHASIA123321') as any;

        const user = await UserModel.query().findOne({ id: tokenPayload.id });
        req.user = user;

        next();
    } catch (err) {
        res.status(401).json({ message: "unauthotized" })   
    }
}

export function checkAccess(role: string[]) {
    return async (req: any, res: Response, next: NextFunction) => {
        const roleUser = await roleRepository.findById(req.user.role_id);
        
        if (!role.includes(roleUser?.role_name as string)) {
            return res.status(401).json({
                message: 'You cannot access this feature'
            })
        }

        next();
    }
}