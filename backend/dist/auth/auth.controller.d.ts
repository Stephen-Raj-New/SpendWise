import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: any): Promise<{
        access_token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            role: string;
        };
    }>;
    register(registerDto: any): Promise<{
        message: string;
        userId: import("mongoose").Types.ObjectId;
        email: string;
        mockOtp: string;
    }>;
    verifyOtp(verifyOtpDto: any): Promise<{
        access_token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            role: string;
        };
    }>;
}
