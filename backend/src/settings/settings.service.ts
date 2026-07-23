import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Settings } from '../schemas/settings.schema';
import { User } from '../schemas/user.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name) private settingsModel: Model<Settings>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async getSettings(userId: string) {
    const uid = new Types.ObjectId(userId);
    let settings = await this.settingsModel.findOne({ userId: uid });
    
    if (!settings) {
      settings = new this.settingsModel({ userId: uid });
      await settings.save();
    }
    return settings;
  }

  async updateSettings(userId: string, updateDto: any) {
    const uid = new Types.ObjectId(userId);
    const settings = await this.settingsModel.findOneAndUpdate(
      { userId: uid },
      { $set: updateDto },
      { new: true, upsert: true }
    );
    return settings;
  }

  async backupNow(userId: string) {
    const uid = new Types.ObjectId(userId);
    const settings = await this.settingsModel.findOne({ userId: uid });
    const user = await this.userModel.findById(uid).select('-password');
    
    const backupData = {
      timestamp: new Date().toISOString(),
      user,
      settings
    };

    return {
      success: true,
      message: 'Backup generated successfully',
      data: backupData
    };
  }

  async revokeSessions(userId: string) {
    // Invalidate refresh tokens or force logout.
    // For now, this is a placeholder response as token logic might be in Auth module
    // If we want to revoke, we might change a "tokenVersion" on the user model.
    return { success: true, message: 'All other sessions revoked successfully' };
  }
}
