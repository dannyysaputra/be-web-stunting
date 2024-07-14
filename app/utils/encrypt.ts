import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const salt = 10;

export async function encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, salt);
}

export async function checkPassword(encryptPassword: string, password: string): Promise<boolean> {
    return bcrypt.compare(password, encryptPassword);
}

export async function createToken(payload: any) {
    return jwt.sign(payload, 'RAHASIA123321', {expiresIn: '86400s'});
}