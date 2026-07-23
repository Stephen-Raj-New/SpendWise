import { Controller, Get, Put, Post, Body, Request, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings(@Request() req: any) {
    return this.settingsService.getSettings(req.user.sub);
  }

  @Put()
  updateSettings(@Request() req: any, @Body() updateDto: any) {
    return this.settingsService.updateSettings(req.user.sub, updateDto);
  }

  @Post('backup')
  backupNow(@Request() req: any) {
    return this.settingsService.backupNow(req.user.sub);
  }

  @Post('revoke-sessions')
  revokeSessions(@Request() req: any) {
    return this.settingsService.revokeSessions(req.user.sub);
  }
}
