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
exports.AppUpdate = void 0;
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const app_service_1 = require("./app.service");
let AppUpdate = class AppUpdate {
    constructor(appService) {
        this.appService = appService;
    }
    async onStart(ctx) {
        return this.appService.onStart(ctx);
    }
    async registrtion(ctx) {
        return this.appService.registration(ctx);
    }
    async hearsMaster(ctx) {
        return this.appService.hearsMaster(ctx);
    }
    async actionService(ctx) {
        return this.appService.hearsServiceTypes(ctx);
    }
    async onContact(ctx) {
        return this.appService.onContact(ctx);
    }
    async next(ctx) {
        return this.appService.hearsNext(ctx);
    }
    async onLocation(ctx) {
        return this.appService.onLocation(ctx);
    }
    async confirm(ctx) {
        return this.appService.requestToAdmin(ctx);
    }
    async cancelConfirm(ctx) {
        return this.appService.cancelRegistration(ctx);
    }
    async allowThisMaster(ctx) {
        return this.appService.confirmInAdmin(ctx);
    }
    async noAllowThisMaster(ctx) {
        return this.appService.noAllow(ctx);
    }
    async blockThis(ctx) {
        return this.appService.toBlock(ctx);
    }
    async checkStatus(ctx) {
        return this.appService.checkStatusMaster(ctx);
    }
    async sendMessage(ctx) {
        return this.appService.sendMessageToAdmin(ctx);
    }
    async cancelRegistration(ctx) {
        await this.appService.cancelRegistration(ctx);
    }
    async hearsClients(ctx) {
        await this.appService.hearsMijozlarInMaster(ctx);
    }
    async hearsRating(ctx) {
        await this.appService.hearsRating(ctx);
    }
    async hearsTime(ctx) {
        return this.appService.hearsTime(ctx);
    }
    async onSearch(ctx) {
        return this.appService.actionSearchForDay(ctx);
    }
    async onMessage(ctx) {
        return this.appService.onMessage(ctx);
    }
};
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "onStart", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("👤 Ro'yhatdan o'tish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "registrtion", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("👨‍🚀 Usta"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "hearsMaster", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(thisservice=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "actionService", null);
__decorate([
    (0, nestjs_telegraf_1.On)("contact"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "onContact", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("⏭ keyingisi"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "next", null);
__decorate([
    (0, nestjs_telegraf_1.On)("location"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "onLocation", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("reqtoadmin"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "confirm", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("delmyinfo"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "cancelConfirm", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(allowto=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "allowThisMaster", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(noallow=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "noAllowThisMaster", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(blockthis=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "blockThis", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("ℹ️ Tekshirish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "checkStatus", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("✍️ Admin bilan bog'lanish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "sendMessage", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("❌ Bekor qilish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "cancelRegistration", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("👥 Mijozlar"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "hearsClients", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("📊 Reyting"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "hearsRating", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🕔 Vaqt"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "hearsTime", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(^search=[\s\S])\w+/g),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "onSearch", null);
__decorate([
    (0, nestjs_telegraf_1.On)("message"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "onMessage", null);
AppUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppUpdate);
exports.AppUpdate = AppUpdate;
//# sourceMappingURL=app.updates.js.map