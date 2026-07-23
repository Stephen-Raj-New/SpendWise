"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("../schemas/notification.schema");
const notifications_gateway_1 = require("./notifications.gateway");
const schedule_1 = require("@nestjs/schedule");
let NotificationsService = class NotificationsService {
    notificationModel;
    notificationsGateway;
    constructor(notificationModel, notificationsGateway) {
        this.notificationModel = notificationModel;
        this.notificationsGateway = notificationsGateway;
    }
    async getNotifications(userId, query) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const filter = { userId: uid };
        if (query.type)
            filter.type = query.type;
        if (query.isRead !== undefined)
            filter.isRead = query.isRead === 'true';
        const [data, total, unreadCount] = await Promise.all([
            this.notificationModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            this.notificationModel.countDocuments(filter),
            this.notificationModel.countDocuments({ userId: uid, isRead: false }),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            unreadCount
        };
    }
    async getGroupedNotifications(userId) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const limitPerGroup = 5;
        const types = ['budget_alert', 'bill_reminder', 'income_received', 'expense_added', 'system_update'];
        const grouped = {};
        await Promise.all(types.map(async (type) => {
            const docs = await this.notificationModel
                .find({ userId: uid, type })
                .sort({ createdAt: -1 })
                .limit(limitPerGroup);
            grouped[type] = docs;
        }));
        const unreadCount = await this.notificationModel.countDocuments({ userId: uid, isRead: false });
        return {
            data: grouped,
            unreadCount
        };
    }
    async markAsRead(userId, id) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        return this.notificationModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), userId: uid }, { $set: { isRead: true } }, { new: true });
    }
    async markAllAsRead(userId) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        await this.notificationModel.updateMany({ userId: uid, isRead: false }, { $set: { isRead: true } });
        return { success: true };
    }
    async deleteNotification(userId, id) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        return this.notificationModel.findOneAndDelete({ _id: new mongoose_2.Types.ObjectId(id), userId: uid });
    }
    async createNotification(userId, payload) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const notification = new this.notificationModel({
            userId: uid,
            ...payload
        });
        const saved = await notification.save();
        this.notificationsGateway.sendNotificationToUser(userId, saved);
        return saved;
    }
    async checkUpcomingBills() {
        console.log('Running scheduled check for upcoming bills...');
    }
};
exports.NotificationsService = NotificationsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsService.prototype, "checkUpcomingBills", null);
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => notifications_gateway_1.NotificationsGateway))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notifications_gateway_1.NotificationsGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map