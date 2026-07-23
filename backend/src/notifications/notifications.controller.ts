import { Controller, Get, Patch, Delete, Param, UseGuards, Request, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Request() req: any, @Query() query: any) {
    const userId = req.user?.sub || req.user?.userId;
    return this.notificationsService.getNotifications(String(userId), query);
  }

  @Get('grouped')
  async getGroupedNotifications(@Request() req: any) {
    const userId = req.user?.sub || req.user?.userId;
    return this.notificationsService.getGroupedNotifications(String(userId));
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req: any) {
    const userId = req.user?.sub || req.user?.userId;
    return this.notificationsService.markAllAsRead(String(userId));
  }

  @Patch(':id/read')
  async markAsRead(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.sub || req.user?.userId;
    return this.notificationsService.markAsRead(String(userId), id);
  }
  
  @Delete(':id')
  async deleteNotification(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.sub || req.user?.userId;
    return this.notificationsService.deleteNotification(String(userId), id);
  }
}
