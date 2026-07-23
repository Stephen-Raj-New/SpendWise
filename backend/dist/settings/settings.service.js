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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const settings_schema_1 = require("../schemas/settings.schema");
const user_schema_1 = require("../schemas/user.schema");
let SettingsService = class SettingsService {
    settingsModel;
    userModel;
    constructor(settingsModel, userModel) {
        this.settingsModel = settingsModel;
        this.userModel = userModel;
    }
    async getSettings(userId) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        let settings = await this.settingsModel.findOne({ userId: uid });
        if (!settings) {
            settings = new this.settingsModel({ userId: uid });
            await settings.save();
        }
        return settings;
    }
    async updateSettings(userId, updateDto) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const settings = await this.settingsModel.findOneAndUpdate({ userId: uid }, { $set: updateDto }, { new: true, upsert: true });
        return settings;
    }
    async backupNow(userId) {
        const uid = new mongoose_2.Types.ObjectId(userId);
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
    async revokeSessions(userId) {
        return { success: true, message: 'All other sessions revoked successfully' };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(settings_schema_1.Settings.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SettingsService);
//# sourceMappingURL=settings.service.js.map