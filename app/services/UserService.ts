import { UserRepository } from "../repositories/UserRepository";
import { UserType } from "../models/UserModel";
import { encryptPassword, checkPassword, createToken } from "../utils/encrypt";
import { RoleRepository } from "../repositories/RoleRepository";

export class UserService {
    private userRepository: UserRepository;
    private roleRepository: RoleRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.roleRepository = new RoleRepository();
    }

    public async registerUser(userData: Partial<UserType>): Promise<UserType> {
        userData.password = await encryptPassword(userData.password as string);

        let role = await this.roleRepository.findByName("user");

        if (role === undefined) {
            role = await this.roleRepository.createRole({ role_name: "user" });
        }

        userData.role_id = role?.id;

        return this.userRepository.createUser(userData);
    }

    public async findUserByEmail(email: string): Promise<UserType | undefined> {
        return this.userRepository.findByEmail(email);
    }

    public async findUserById(id: string): Promise<UserType | undefined> {
        return this.userRepository.findById(id);
    }

    public async verifyPassword(storedPassword: string, providedPassword: string): Promise<boolean> {
        return await checkPassword(storedPassword, providedPassword);
      }
    
    public async generateToken(user: UserType): Promise<string> {
    return await createToken({
        id: user.id,
        email: user.email,
        role: user.role_id,
        createdAt: user.created_at,
        updatedAt: user.updated_at
    });
    }

    public async googleId(user: UserType, googleId: string): Promise<void> {
        await this.userRepository.createGoogleId(user, googleId);
    }
}