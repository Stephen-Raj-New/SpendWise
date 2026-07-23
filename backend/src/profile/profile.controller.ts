import { Controller, Get, Put, Post, Delete, Patch, Body, Request, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('user/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@Request() req: any) {
    return this.profileService.getProfile(req.user.sub);
  }

  @Put()
  updateProfile(@Request() req: any, @Body() updateDto: any) {
    return this.profileService.updateProfile(req.user.sub, updateDto);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @Request() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' }),
        ],
      }),
    ) file: Express.Multer.File
  ) {
    return this.profileService.uploadAvatar(req.user.sub, file);
  }

  @Delete('avatar')
  removeAvatar(@Request() req: any) {
    return this.profileService.removeAvatar(req.user.sub);
  }

  @Put('preferences')
  updatePreferences(@Request() req: any, @Body() updateDto: any) {
    return this.profileService.updatePreferences(req.user.sub, updateDto);
  }

  @Put('password')
  updatePassword(@Request() req: any, @Body() updateDto: any) {
    return this.profileService.updatePassword(req.user.sub, updateDto);
  }

  @Patch('2fa')
  toggle2fa(@Request() req: any, @Body('enabled') enabled: boolean) {
    return this.profileService.toggle2fa(req.user.sub, enabled);
  }

  @Patch('deactivate')
  deactivateAccount(@Request() req: any, @Body('password') password: string) {
    return this.profileService.deactivateAccount(req.user.sub, password);
  }
}
