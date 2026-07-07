import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    login(loginDto: any): Promise<{
        access_token: string;
    }>;
}
