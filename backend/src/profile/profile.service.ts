import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, updateDto: any) {
    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { fullName: updateDto.fullName, jobTitle: updateDto.jobTitle, mobileNumber: updateDto.phoneNumber || updateDto.mobileNumber } },
      { new: true }
    ).select('-password');
    
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    // Convert to base64
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    
    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { avatarUrl: base64Image } },
      { new: true }
    ).select('-password');
    
    return { avatarUrl: updated?.avatarUrl };
  }

  async removeAvatar(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { $unset: { avatarUrl: 1 } });
    return { success: true };
  }

  async updatePreferences(userId: string, updateDto: any) {
    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { preferences: updateDto } },
      { new: true }
    ).select('-password');
    return updated?.preferences;
  }

  async updatePassword(userId: string, updateDto: any) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(updateDto.currentPassword, user.password || '');
    if (!isMatch) {
      throw new BadRequestException('Incorrect current password');
    }

    if (updateDto.newPassword !== updateDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(updateDto.newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    return { success: true, message: 'Password updated successfully' };
  }

  async toggle2fa(userId: string, enabled: boolean) {
    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { twoFactorEnabled: enabled } },
      { new: true }
    ).select('-password');
    return { twoFactorEnabled: updated?.twoFactorEnabled };
  }

  async deactivateAccount(userId: string, password: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      throw new BadRequestException('Incorrect password');
    }

    user.isActive = false;
    await user.save();
    
    return { success: true, message: 'Account deactivated' };
  }
}
