import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
        user: {
            email: any;
            firstName: any;
            lastName: any;
            role: any;
        };
    }>;
    register(userDto: any): Promise<import("../users/schemas/user.schema").UserDocument>;
}
