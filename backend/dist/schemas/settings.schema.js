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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsSchema = exports.Settings = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Settings = class Settings extends mongoose_2.Document {
    userId;
    appearance;
    notifications;
    privacy;
};
exports.Settings = Settings;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, unique: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Settings.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
            compactMode: { type: Boolean, default: false }
        },
        default: () => ({ theme: 'light', compactMode: false })
    }),
    __metadata("design:type", Object)
], Settings.prototype, "appearance", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            sms: { type: Boolean, default: false }
        },
        default: () => ({ email: true, push: true, sms: false })
    }),
    __metadata("design:type", Object)
], Settings.prototype, "notifications", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            profileVisibility: { type: String, enum: ['internal_only', 'private'], default: 'internal_only' },
            twoFactorEnabled: { type: Boolean, default: false }
        },
        default: () => ({ profileVisibility: 'internal_only', twoFactorEnabled: false })
    }),
    __metadata("design:type", Object)
], Settings.prototype, "privacy", void 0);
exports.Settings = Settings = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Settings);
exports.SettingsSchema = mongoose_1.SchemaFactory.createForClass(Settings);
//# sourceMappingURL=settings.schema.js.map