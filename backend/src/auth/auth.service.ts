import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async register(registerDto: any) {
    const { email, password, mobileNumber, fullName, preferredCurrency, timeZone } = registerDto;

    // Check if user exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const existingMobile = await this.usersService.findByMobile(mobileNumber);
    if (existingMobile) {
      throw new BadRequestException('User with this mobile number already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Create unverified user
    const user = await this.usersService.create({
      fullName,
      email,
      password: hashedPassword,
      mobileNumber,
      preferredCurrency,
      timeZone,
      isVerified: false,
      role: 'user',
      otp,
      otpExpiresAt,
    });

    console.log(`[DEV_MOCK_OTP] Generated OTP for ${email}: ${otp}`);

    return {
      message: 'Registration successful. Please verify OTP.',
      userId: user._id,
      email: user.email,
      mockOtp: otp // DEV ONLY: send it back so friends can test the UI easily
    };
  }

  async verifyOtp(verifyOtpDto: any) {
    const { email, otp } = verifyOtpDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('User is already verified');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    // Mark as verified
    await this.usersService.update((user._id as any).toString(), {
      isVerified: true,
      otp: null,
      otpExpiresAt: null,
    });

    // Generate JWT
    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    };
  }

  async login(loginDto: any) {
    const { email, password } = loginDto;
    
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email/mobile first');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password as string);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    };
  }
}
