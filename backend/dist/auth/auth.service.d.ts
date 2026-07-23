import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private jwtService;
    private usersService;
    constructor(jwtService: JwtService, usersService: UsersService);
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
            mobileNumber: string;
        };
    }>;
    login(loginDto: any): Promise<{
        access_token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            role: string;
            mobileNumber: string;
        };
    }>;
}
