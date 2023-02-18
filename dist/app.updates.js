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
const admin_service_1 = require("./admin.service");
let AppUpdate = class AppUpdate {
    constructor(appService, adminService) {
        this.appService = appService;
        this.adminService = adminService;
    }
    async enterToAdmin(ctx) {
        return this.adminService.commandAdmin(ctx);
    }
    async properties(ctx) {
        return this.adminService.showProperties(ctx);
    }
    async addServiceType(ctx) {
        return this.adminService.addServiceType(ctx);
    }
    async seeMasters(ctx) {
        return this.adminService.seeMasters(ctx);
    }
    async hearsService(ctx) {
        return this.adminService.hearsServiceFields(ctx);
    }
    async toMainMenu(ctx) {
        return this.adminService.toMainMenu(ctx);
    }
    async mMenu(ctx) {
        return this.adminService.toMainMenu(ctx);
    }
    async reAddNewItem(ctx) {
        return this.adminService.reAddNewItem(ctx);
    }
    async searchByName(ctx) {
        return this.adminService.searchByName(ctx);
    }
    async searchByNumber(ctx) {
        return this.adminService.searchByNumber(ctx);
    }
    async onMessage(ctx) {
        return this.adminService.onMessage(ctx);
    }
};
__decorate([
    (0, nestjs_telegraf_1.Command)('admin'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "enterToAdmin", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('🧰 Xizmatlar'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "properties", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("⏬ Xizmat qo'shish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "addServiceType", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('🧖‍♂️ Ustalar'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "seeMasters", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(fields=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "hearsService", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('🏠 Bosh menyu'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "toMainMenu", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('mainmenu'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "mMenu", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("♻️ Yana qo'shish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "reAddNewItem", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🔍 Ism bo'yicha izlash"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "searchByName", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("📱 telefon raqami bo'yicha izlash"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "searchByNumber", null);
__decorate([
    (0, nestjs_telegraf_1.On)('message'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "onMessage", null);
AppUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        admin_service_1.AdminService])
], AppUpdate);
exports.AppUpdate = AppUpdate;
//# sourceMappingURL=app.updates.js.map