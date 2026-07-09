import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: any) {
    const { email, password, role } = loginDto;
    
    // DEV SIMULATION
    // In a real app, you would check against the Users module (e.g. usersService.findByEmail)
    // and verify the hashed password using bcrypt.
    const isValidUser = (role === 'admin' && email === 'admin@expensepro.com' && password === 'User@123') ||
                        (role === 'user' && email === 'user@expensepro.com' && password === 'User@123');

    if (!isValidUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    // Use a valid 24-character hex string so MongoDB ObjectId casting works for all modules
    const payload = { sub: '507f1f77bcf86cd799439011', email, role }; // `sub` should be the user's ObjectId from DB
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
