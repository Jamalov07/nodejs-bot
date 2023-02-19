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
    async reTurn(ctx) {
        return this.adminService.showProperties(ctx);
    }
    async addServiceType(ctx) {
        return this.adminService.addServiceType(ctx);
    }
    async seeAllServiceTypes(ctx) {
        return this.adminService.seeAllServiceTypes(ctx);
    }
    async seeMasters(ctx) {
        return this.adminService.complectMasters(ctx);
    }
    async sendMessageUser(ctx) {
        return this.adminService.sendMessageUser(ctx);
    }
    async hearsService(ctx) {
        return this.adminService.hearsServiceFields(ctx);
    }
    async sendSms(ctx) {
        await this.adminService.sendMessageAll(ctx);
    }
    async sendSmsAll(ctx) {
        return this.adminService.sendMessageAll(ctx);
    }
    async sendSmsUser(ctx) {
        return this.adminService.sendMessageUser(ctx);
    }
    async sendAllSms(ctx) {
        return this.adminService.sendMessageAll(ctx);
    }
    async toMainMenu(ctx) {
        return this.adminService.toMainMenu(ctx);
    }
    async complectMasters(ctx) {
        return this.adminService.complectMasters(ctx);
    }
    async mMenu(ctx) {
        return this.adminService.toMainMenu(ctx);
    }
    async ReturnToSearchUser(ctx) {
        return this.adminService.seeUsers(ctx);
    }
    async deleteMaster(ctx) {
        return this.adminService.deleteMaster(ctx);
    }
    async deActiveMaster(ctx) {
        return this.adminService.deActiveMaster(ctx);
    }
    async showStats(ctx) {
        return this.adminService.showStatics(ctx);
    }
    async sendMessageToMaster(ctx) {
        return this.adminService.sendMessage(ctx);
    }
    async deleteField(ctx) {
        return this.adminService.removeFields(ctx);
    }
    async updateField(ctx) {
        return this.adminService.updateFields(ctx);
    }
    async banUser(ctx) {
        return this.adminService.doBan(ctx);
    }
    async debanUser(ctx) {
        return this.adminService.deBan(ctx);
    }
    async isBanUser(ctx) {
        return this.adminService.isBan(ctx);
    }
    async statsUser(ctx) {
        return this.adminService.userStat(ctx);
    }
    async nextElement(ctx) {
        console.log("afjbasd");
        return this.adminService.nextElement(ctx);
    }
    async messageToUser(ctx) {
        return this.adminService.msgToUser(ctx);
    }
    async buttonBan(ctx) {
        return this.adminService.doBan(ctx);
    }
    async reAddNewItem(ctx) {
        return this.adminService.reAddNewItem(ctx);
    }
    async buttonUnBan(ctx) {
        return this.adminService.deBan(ctx);
    }
    async reSeeMasters(ctx) {
        return this.adminService.complectMasters(ctx);
    }
    async searchByName(ctx) {
        return this.adminService.searchByName(ctx);
    }
    async reAgainByNumber(ctx) {
        return this.adminService.searchByNumber(ctx);
    }
    async changeFields(ctx) {
        return this.adminService.changeFields(ctx);
    }
    async reChangeServiceType(ctx) {
        return this.adminService.changeFields(ctx);
    }
    async reDeleteServiceType(ctx) {
        return this.adminService.deleteFields(ctx);
    }
    async deleteFields(ctx) {
        return this.adminService.deleteFields(ctx);
    }
    async searchByNumber(ctx) {
        return this.adminService.searchByNumber(ctx);
    }
    async clients(ctx) {
        return this.adminService.seeUsers(ctx);
    }
    async returnToUserMenu(ctx) {
        return this.adminService.seeUsers(ctx);
    }
    async reSeeClients(ctx) {
        return this.adminService.seeUsers(ctx);
    }
    async retur(ctx) {
        return this.adminService.seeUsers(ctx);
    }
    async returnToSearch(ctx) {
        return this.adminService.seeUsers(ctx);
    }
    async searchUserByPhone(ctx) {
        return this.adminService.searchUserByPhone(ctx);
    }
    async searchByUserByName(ctx) {
        return this.adminService.searchUserByName(ctx);
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
    (0, nestjs_telegraf_1.Hears)("🧰 Xizmatlar bo'limiga qaytish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "reTurn", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("⏬ Xizmat qo'shish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "addServiceType", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("👀 Barcha xizmatlarni ko'rish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "seeAllServiceTypes", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('🧖‍♂️ Ustalar'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "seeMasters", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('sSmsAllUser'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "sendMessageUser", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(fields=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "hearsService", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('sendAllSms'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "sendSms", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('✍️ Hamma masterlarga xabar yuborish'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "sendSmsAll", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('✍️ Hamma userlarga xabar yuborish'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "sendSmsUser", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('SendAllSms'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "sendAllSms", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('🏠 Bosh menyu'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "toMainMenu", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🛠 Yo'nalishlar ro'yxatiga qaytish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "complectMasters", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('mainmenu'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "mMenu", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('returntosearch'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "ReturnToSearchUser", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(delmaster=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "deleteMaster", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(deactivemas=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "deActiveMaster", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(showstats=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "showStats", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(sendmess=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "sendMessageToMaster", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(deletefield=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "deleteField", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(changefield=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "updateField", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(banuser=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "banUser", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(debanuser=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "debanUser", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(isban=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "isBanUser", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(statuser=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "statsUser", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(^next=[\s\S])\w+/g),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "nextElement", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(msguser=\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "messageToUser", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("✔️ Userni ban qilish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "buttonBan", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("♻️ Yana qo'shish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "reAddNewItem", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("✔️ Userni bandan yechish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "buttonUnBan", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("👨‍⚕️ Usta yo'nalishlariga qaytish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "reSeeMasters", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🔍 Ism bo'yicha izlash"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "searchByName", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("📱 Yana telefon raqami orqali izlash"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "reAgainByNumber", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('🛂 Tahrirlash'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "changeFields", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🔄 Yana boshqa service typeni o'zgartirish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "reChangeServiceType", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🗑 Yana boshqa service turini o'chirib tashlash"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "reDeleteServiceType", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🗑 O'chirib tashlash"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "deleteFields", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("📱 telefon raqami bo'yicha izlash"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "searchByNumber", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('🙍‍♂️ Mijozlar'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "clients", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🙍‍♂️ Mijozlar bo'limiga qaytish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "returnToUserMenu", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🙍‍♂️ Mijozlarni izlashda davom etish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "reSeeClients", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🙍‍♂️ Mijozlarni bo'limiga qaytish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "retur", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('returntosearch'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "returnToSearch", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('📱 Telefon raqam orqali'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "searchUserByPhone", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('🔎 Ism orqali izlash'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "searchByUserByName", null);
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