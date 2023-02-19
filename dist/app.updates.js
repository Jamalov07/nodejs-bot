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
const admin_service_1 = require("./admin.service");
const app_service_1 = require("./app.service");
let AppUpdate = class AppUpdate {
    constructor(appService, adminService) {
        this.appService = appService;
        this.adminService = adminService;
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
    async booking(ctx) {
        return this.appService.bookingWithMaster(ctx);
    }
    async bookedwithuser(ctx) {
        return this.appService.bookedWithUser(ctx);
    }
    async bookedwithMe(ctx) {
        return this.appService.bookedWithMeUpdate(ctx);
    }
    async fullDayNotBusy(ctx) {
        return this.appService.fullDayNotBusy(ctx);
    }
    async fullDayBusy(ctx) {
        return this.appService.busyFullDayMaster(ctx);
    }
    async toBackDates(ctx) {
        return this.appService.toBack(ctx);
    }
    async hearsUpdateInfo(ctx) {
        return this.appService.updateMasterInfos(ctx);
    }
    async changeName(ctx) {
        await this.appService.actionChange(ctx, "change_name");
    }
    async changePhone(ctx) {
        await this.appService.actionChange(ctx, "change_phone");
    }
    async changeservice_name(ctx) {
        await this.appService.actionChange(ctx, "change_service_name");
    }
    async changeaddress(ctx) {
        await this.appService.actionChange(ctx, "change_address");
    }
    async changetarget(ctx) {
        await this.appService.actionChange(ctx, "change_target");
    }
    async changelocation(ctx) {
        await this.appService.actionChange(ctx, "change_location");
    }
    async changestart_time(ctx) {
        await this.appService.actionChange(ctx, "change_start_time");
    }
    async changeend_time(ctx) {
        await this.appService.actionChange(ctx, "change_end_time");
    }
    async changetime_per_work(ctx) {
        await this.appService.actionChange(ctx, "change_time_per_work");
    }
    async tomainmenu(ctx) {
        await this.appService.tomainmenu(ctx);
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
        return this.appService.complectMasters(ctx);
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
        return this.appService.complectMasters(ctx);
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
        return this.appService.complectMasters(ctx);
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
    async commandMijoz(ctx) {
        return this.appService.onMijoz(ctx);
    }
    async onMijoz(ctx) {
        return this.appService.onMijoz(ctx);
    }
    async changeMijozData(ctx) {
        return this.appService.changeMijozData(ctx);
    }
    async changeMijozIsm(ctx) {
        return this.appService.changeName(ctx);
    }
    async changeMijozPhone(ctx) {
        return this.appService.changeNumber(ctx);
    }
    async xizmatlar(ctx) {
        return this.appService.onServices(ctx);
    }
    async goBack(ctx) {
        return this.appService.orqaga(ctx);
    }
    async searchNameService(ctx) {
        return this.appService.serachNameMijoz(ctx);
    }
    async searchRatingService(ctx) {
        return this.appService.serachRatingMijoz(ctx);
    }
    async onLocationMijoz(ctx) {
        return this.appService.onLocationMijoz(ctx);
    }
    async tanlangan_hizmatlar(ctx) {
        return this.appService.tanlanganHizmatlar(ctx);
    }
    async selectService(ctx) {
        return this.appService.selectServices(ctx);
    }
    async prevMastersName(ctx) {
        return this.appService.onPaginationName(ctx);
    }
    async prevMastersRating(ctx) {
        return this.appService.onPaginationRating(ctx);
    }
    async prevMastersLocation(ctx) {
        return this.appService.onPaginationLocation(ctx);
    }
    async prevMastersTime(ctx) {
        return this.appService.onPaginationTime(ctx);
    }
    async selectMaster(ctx) {
        return this.appService.selectMaster(ctx);
    }
    async masterLocation(ctx) {
        return this.appService.showLocation(ctx);
    }
    async getRank(ctx) {
        return this.appService.getRank(ctx);
    }
    async getTimes(ctx) {
        return this.appService.getTimes(ctx);
    }
    async timeSelect(ctx) {
        return this.appService.sendSmsMaster(ctx);
    }
    async confirmYes(ctx) {
        return this.appService.confirmMessage(ctx);
    }
    async confirmNo(ctx) {
        return this.appService.confirmMessage(ctx);
    }
    async Ranking(ctx) {
        return this.appService.toRankings(ctx);
    }
    async getTimeOrder(ctx) {
        return this.appService.getDays(ctx);
    }
    async goBackAction(ctx) {
        return this.appService.orqaga(ctx);
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
    (0, nestjs_telegraf_1.Action)(/(^booking:[\s\S])\w+/g),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "booking", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(^bookwithuser:[\s\S])\w+/g),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "bookedwithuser", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(^bookedwithme:[\s\S])\w+/g),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "bookedwithMe", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(^fulldaynotbusy:[\s\S])\w+/g),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "fullDayNotBusy", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(^fulldaybusy:[\s\S])\w+/g),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "fullDayBusy", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("toback:dates"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "toBackDates", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🔄 Ma'lumotlarni o'zgartirish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "hearsUpdateInfo", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("change_name"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "changeName", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("change_phone"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "changePhone", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("change_service_name"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "changeservice_name", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("change_address"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "changeaddress", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("change_target"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "changetarget", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("change_location"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "changelocation", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("change_start_time"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "changestart_time", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("change_end_time"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "changeend_time", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("change_time_per_work"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "changetime_per_work", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("tomainmenu"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "tomainmenu", null);
__decorate([
    (0, nestjs_telegraf_1.Command)("admin"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "enterToAdmin", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🧰 Xizmatlar"),
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
    (0, nestjs_telegraf_1.Hears)("🧖‍♂️ Ustalar"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "seeMasters", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("sSmsAllUser"),
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
    (0, nestjs_telegraf_1.Action)("sendAllSms"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "sendSms", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("✍️ Hamma masterlarga xabar yuborish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "sendSmsAll", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("✍️ Hamma userlarga xabar yuborish"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "sendSmsUser", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("SendAllSms"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "sendAllSms", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🏠 Bosh menyu"),
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
    (0, nestjs_telegraf_1.Action)("mainmenu"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "mMenu", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("returntosearch"),
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
    (0, nestjs_telegraf_1.Hears)("🛂 Tahrirlash"),
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
    (0, nestjs_telegraf_1.Hears)("🙍‍♂️ Mijozlar"),
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
    (0, nestjs_telegraf_1.Action)("returntosearch"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "returnToSearch", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("📱 Telefon raqam orqali"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "searchUserByPhone", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🔎 Ism orqali izlash"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "searchByUserByName", null);
__decorate([
    (0, nestjs_telegraf_1.Command)("Mijoz"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "commandMijoz", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("🤵‍♂️ Mijoz"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "onMijoz", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("MA’LUMOTLARNI O’ZGARTIRISH 📝"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "changeMijozData", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("Ism, Familiya ✏️"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "changeMijozIsm", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("Telefon raqam 📞"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "changeMijozPhone", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("XIZMATLAR 📂"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "xizmatlar", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("orqaga ↩️"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "goBack", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("ISMI 📝"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "searchNameService", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("REYTING ⭐️"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "searchRatingService", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("Lokatsiya 📍"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "onLocationMijoz", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)("TANLANGAN XIZMATLAR 📥"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "tanlangan_hizmatlar", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^(service-\d+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "selectService", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(prevMastersName-[^c])/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "prevMastersName", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(prevMastersRating-[^c])/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "prevMastersRating", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(prevMastersLocation-[^c])/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "prevMastersLocation", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(prevMastersTime-[^c])/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "prevMastersTime", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(master-[^c])/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "selectMaster", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(masterLocation-[^c])/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "masterLocation", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(getRank-[^c])/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "getRank", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(day-[^c])/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "getTimes", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(timeSelect-[^c])/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "timeSelect", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(xa-[^c])/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "confirmYes", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/(yo'q-[^c])/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "confirmNo", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("Ranking"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "Ranking", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("getTimeOrder"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "getTimeOrder", null);
__decorate([
    (0, nestjs_telegraf_1.Action)("goBack"),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], AppUpdate.prototype, "goBackAction", null);
__decorate([
    (0, nestjs_telegraf_1.On)("message"),
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