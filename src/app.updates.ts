import {
  Action,
  Command,
  Ctx,
  Hears,
  On,
  Start,
  Update,
} from "nestjs-telegraf";
import { Context } from "telegraf";
import { AdminService } from "./admin.service";
import { AppService } from "./app.service";

@Update()
export class AppUpdate {
  constructor(
    private readonly appService: AppService,
    private readonly adminService: AdminService
  ) {}
  @Start()
  async onStart(@Ctx() ctx: Context) {
    return this.appService.onStart(ctx);
  }

  @Hears("đ¤ Ro'yhatdan o'tish")
  async registrtion(@Ctx() ctx: Context) {
    return this.appService.registration(ctx);
  }

  @Hears("đ¨âđ Usta")
  async hearsMaster(@Ctx() ctx: Context) {
    return this.appService.hearsMaster(ctx);
  }

  @Action(/^(thisservice=\d+)/)
  async actionService(@Ctx() ctx: Context) {
    return this.appService.hearsServiceTypes(ctx);
  }

  @On("contact")
  async onContact(@Ctx() ctx: Context) {
    return this.appService.onContact(ctx);
  }

  @Hears("â­ keyingisi")
  async next(@Ctx() ctx: Context) {
    return this.appService.hearsNext(ctx);
  }

  @On("location")
  async onLocation(@Ctx() ctx: Context) {
    return this.appService.onLocation(ctx);
  }

  @Action("reqtoadmin")
  async confirm(@Ctx() ctx: Context) {
    return this.appService.requestToAdmin(ctx);
  }

  @Action("delmyinfo")
  async cancelConfirm(@Ctx() ctx: Context) {
    return this.appService.cancelRegistration(ctx);
  }

  @Action(/^(allowto=\d+)/)
  async allowThisMaster(@Ctx() ctx: Context) {
    return this.appService.confirmInAdmin(ctx);
  }

  @Action(/^(noallow=\d+)/)
  async noAllowThisMaster(@Ctx() ctx: Context) {
    return this.appService.noAllow(ctx);
  }

  @Action(/^(blockthis=\d+)/)
  async blockThis(@Ctx() ctx: Context) {
    return this.appService.toBlock(ctx);
  }

  @Hears("âšī¸ Tekshirish")
  async checkStatus(@Ctx() ctx: Context) {
    return this.appService.checkStatusMaster(ctx);
  }

  @Hears("âī¸ Admin bilan bog'lanish")
  async sendMessage(@Ctx() ctx: Context) {
    return this.appService.sendMessageToAdmin(ctx);
  }

  @Hears("â Bekor qilish")
  async cancelRegistration(@Ctx() ctx: Context) {
    await this.appService.cancelRegistration(ctx);
  }

  @Hears("đĨ Mijozlar")
  async hearsClients(@Ctx() ctx: Context) {
    await this.appService.hearsMijozlarInMaster(ctx);
  }

  @Hears("đ Reyting")
  async hearsRating(@Ctx() ctx: Context) {
    await this.appService.hearsRating(ctx);
  }

  @Hears("đ Vaqt")
  async hearsTime(@Ctx() ctx: Context) {
    return this.appService.hearsTime(ctx);
  }

  @Action(/(^search=[\s\S])\w+/g)
  async onSearch(@Ctx() ctx: Context) {
    return this.appService.actionSearchForDay(ctx);
  }

  @Action(/(^booking:[\s\S])\w+/g)
  async booking(@Ctx() ctx: Context) {
    return this.appService.bookingWithMaster(ctx);
  }

  @Action(/(^bookwithuser:[\s\S])\w+/g)
  async bookedwithuser(@Ctx() ctx: Context) {
    return this.appService.bookedWithUser(ctx);
  }

  @Action(/(^bookedwithme:[\s\S])\w+/g)
  async bookedwithMe(@Ctx() ctx: Context) {
    return this.appService.bookedWithMeUpdate(ctx);
  }

  @Action(/(^fulldaynotbusy:[\s\S])\w+/g)
  async fullDayNotBusy(@Ctx() ctx: Context) {
    return this.appService.fullDayNotBusy(ctx);
  }

  @Action(/(^fulldaybusy:[\s\S])\w+/g)
  async fullDayBusy(@Ctx() ctx: Context) {
    return this.appService.busyFullDayMaster(ctx);
  }

  @Action("toback:dates")
  async toBackDates(@Ctx() ctx: Context) {
    return this.appService.toBack(ctx);
  }

  @Hears("đ Ma'lumotlarni o'zgartirish")
  async hearsUpdateInfo(@Ctx() ctx: Context) {
    return this.appService.updateMasterInfos(ctx);
  }

  @Action("change_name")
  async changeName(@Ctx() ctx: Context) {
    await this.appService.actionChange(ctx, "change_name");
  }

  @Action("change_phone")
  async changePhone(@Ctx() ctx: Context) {
    await this.appService.actionChange(ctx, "change_phone");
  }

  @Action("change_service_name")
  async changeservice_name(@Ctx() ctx: Context) {
    await this.appService.actionChange(ctx, "change_service_name");
  }

  @Action("change_address")
  async changeaddress(@Ctx() ctx: Context) {
    await this.appService.actionChange(ctx, "change_address");
  }

  @Action("change_target")
  async changetarget(@Ctx() ctx: Context) {
    await this.appService.actionChange(ctx, "change_target");
  }

  @Action("change_location")
  async changelocation(@Ctx() ctx: Context) {
    await this.appService.actionChange(ctx, "change_location");
  }
  @Action("change_start_time")
  async changestart_time(@Ctx() ctx: Context) {
    await this.appService.actionChange(ctx, "change_start_time");
  }
  @Action("change_end_time")
  async changeend_time(@Ctx() ctx: Context) {
    await this.appService.actionChange(ctx, "change_end_time");
  }
  @Action("change_time_per_work")
  async changetime_per_work(@Ctx() ctx: Context) {
    await this.appService.actionChange(ctx, "change_time_per_work");
  }

  @Action("tomainmenu")
  async tomainmenu(@Ctx() ctx: Context) {
    await this.appService.tomainmenu(ctx);
  }
  // ====== Abdulaziz =====

  @Command("admin")
  async enterToAdmin(@Ctx() ctx: Context) {
    return this.adminService.commandAdmin(ctx);
  }

  @Hears("đ§° Xizmatlar")
  async properties(@Ctx() ctx: Context) {
    return this.adminService.showProperties(ctx);
  }

  @Hears("đ§° Xizmatlar bo'limiga qaytish")
  async reTurn(@Ctx() ctx: Context) {
    return this.adminService.showProperties(ctx);
  }
  @Hears("âŦ Xizmat qo'shish")
  async addServiceType(@Ctx() ctx: Context) {
    return this.adminService.addServiceType(ctx);
  }

  @Hears("đ Barcha xizmatlarni ko'rish")
  async seeAllServiceTypes(@Ctx() ctx: Context) {
    return this.adminService.seeAllServiceTypes(ctx);
  }
  @Hears("đ§ââī¸ Ustalar")
  async seeMasters(@Ctx() ctx: Context) {
    return this.appService.complectMasters(ctx);
  }
  @Action("sSmsAllUser")
  async sendMessageUser(@Ctx() ctx: Context) {
    return this.adminService.sendMessageUser(ctx);
  }
  @Action(/^(fields=\d+)/)
  async hearsService(@Ctx() ctx: Context) {
    return this.adminService.hearsServiceFields(ctx);
  }

  @Action("sendAllSms")
  async sendSms(@Ctx() ctx: Context) {
    await this.adminService.sendMessageAll(ctx);
  }

  @Hears("âī¸ Hamma masterlarga xabar yuborish")
  async sendSmsAll(@Ctx() ctx: Context) {
    return this.adminService.sendMessageAll(ctx);
  }

  @Hears("âī¸ Hamma userlarga xabar yuborish")
  async sendSmsUser(@Ctx() ctx: Context) {
    return this.adminService.sendMessageUser(ctx);
  }
  @Action("SendAllSms")
  async sendAllSms(@Ctx() ctx: Context) {
    return this.adminService.sendMessageAll(ctx);
  }
  @Hears("đ  Bosh menyu")
  async toMainMenu(@Ctx() ctx: Context) {
    return this.adminService.toMainMenu(ctx);
  }
  @Hears("đ  Yo'nalishlar ro'yxatiga qaytish")
  async complectMasters(@Ctx() ctx: Context) {
    return this.appService.complectMasters(ctx);
  }
  @Action("mainmenu")
  async mMenu(@Ctx() ctx: Context) {
    return this.adminService.toMainMenu(ctx);
  }

  @Action("returntosearch")
  async ReturnToSearchUser(@Ctx() ctx: Context) {
    return this.adminService.seeUsers(ctx);
  }
  @Action(/^(delmaster=\d+)/)
  async deleteMaster(@Ctx() ctx: Context) {
    return this.adminService.deleteMaster(ctx);
  }
  @Action(/^(deactivemas=\d+)/)
  async deActiveMaster(@Ctx() ctx: Context) {
    return this.adminService.deActiveMaster(ctx);
  }
  @Action(/^(showstats=\d+)/)
  async showStats(@Ctx() ctx: Context) {
    return this.adminService.showStatics(ctx);
  }
  @Action(/^(sendmess=\d+)/)
  async sendMessageToMaster(@Ctx() ctx: Context) {
    return this.adminService.sendMessage(ctx);
  }

  @Action(/^(deletefield=\d+)/)
  async deleteField(@Ctx() ctx: Context) {
    return this.adminService.removeFields(ctx);
  }
  @Action(/^(changefield=\d+)/)
  async updateField(@Ctx() ctx: Context) {
    return this.adminService.updateFields(ctx);
  }
  @Action(/^(banuser=\d+)/)
  async banUser(@Ctx() ctx: Context) {
    return this.adminService.doBan(ctx);
  }
  @Action(/^(debanuser=\d+)/)
  async debanUser(@Ctx() ctx: Context) {
    return this.adminService.deBan(ctx);
  }

  @Action(/^(isban=\d+)/)
  async isBanUser(@Ctx() ctx: Context) {
    return this.adminService.isBan(ctx);
  }

  @Action(/^(statuser=\d+)/)
  async statsUser(@Ctx() ctx: Context) {
    return this.adminService.userStat(ctx);
  }

  @Action(/(^next=[\s\S])\w+/g)
  async nextElement(@Ctx() ctx: Context) {
    console.log("afjbasd");
    return this.adminService.nextElement(ctx);
  }
  @Action(/^(msguser=\d+)/)
  async messageToUser(@Ctx() ctx: Context) {
    return this.adminService.msgToUser(ctx);
  }
  @Hears("âī¸ Userni ban qilish")
  async buttonBan(@Ctx() ctx: Context) {
    return this.adminService.doBan(ctx);
  }
  @Hears("âģī¸ Yana qo'shish")
  async reAddNewItem(@Ctx() ctx: Context) {
    return this.adminService.reAddNewItem(ctx);
  }
  @Hears("âī¸ Userni bandan yechish")
  async buttonUnBan(@Ctx() ctx: Context) {
    return this.adminService.deBan(ctx);
  }
  @Hears("đ¨ââī¸ Usta yo'nalishlariga qaytish")
  async reSeeMasters(@Ctx() ctx: Context) {
    return this.appService.complectMasters(ctx);
  }
  @Hears("đ Ism bo'yicha izlash")
  async searchByName(@Ctx() ctx: Context) {
    return this.adminService.searchByName(ctx);
  }
  @Hears("đą Yana telefon raqami orqali izlash")
  async reAgainByNumber(@Ctx() ctx: Context) {
    return this.adminService.searchByNumber(ctx);
  }
  @Hears("đ Tahrirlash")
  async changeFields(@Ctx() ctx: Context) {
    return this.adminService.changeFields(ctx);
  }
  @Hears("đ Yana boshqa service typeni o'zgartirish")
  async reChangeServiceType(@Ctx() ctx: Context) {
    return this.adminService.changeFields(ctx);
  }
  @Hears("đ Yana boshqa service turini o'chirib tashlash")
  async reDeleteServiceType(@Ctx() ctx: Context) {
    return this.adminService.deleteFields(ctx);
  }
  @Hears("đ O'chirib tashlash")
  async deleteFields(@Ctx() ctx: Context) {
    return this.adminService.deleteFields(ctx);
  }
  @Hears("đą telefon raqami bo'yicha izlash")
  async searchByNumber(@Ctx() ctx: Context) {
    return this.adminService.searchByNumber(ctx);
  }
  @Hears("đââī¸ Mijozlar")
  async clients(@Ctx() ctx: Context) {
    return this.adminService.seeUsers(ctx);
  }

  @Hears("đââī¸ Mijozlar bo'limiga qaytish")
  async returnToUserMenu(@Ctx() ctx: Context) {
    return this.adminService.seeUsers(ctx);
  }
  @Hears("đââī¸ Mijozlarni izlashda davom etish")
  async reSeeClients(@Ctx() ctx: Context) {
    return this.adminService.seeUsers(ctx);
  }

  @Hears("đââī¸ Mijozlarni bo'limiga qaytish")
  async retur(@Ctx() ctx: Context) {
    return this.adminService.seeUsers(ctx);
  }

  @Action("returntosearch")
  async returnToSearch(@Ctx() ctx: Context) {
    return this.adminService.seeUsers(ctx);
  }
  @Hears("đą Telefon raqam orqali")
  async searchUserByPhone(@Ctx() ctx: Context) {
    return this.adminService.searchUserByPhone(ctx);
  }

  @Hears("đ Ism orqali izlash")
  async searchByUserByName(@Ctx() ctx: Context) {
    return this.adminService.searchUserByName(ctx);
  }

  // ========


  // ========


  @Command("Mijoz")
  async commandMijoz(@Ctx() ctx: Context) {
    return this.appService.onMijoz(ctx);
  }
  @Hears("đ¤ĩââī¸ Mijoz")
  async onMijoz(@Ctx() ctx: Context) {
    return this.appService.onMijoz(ctx);
  }
  @Hears("MAâLUMOTLARNI OâZGARTIRISH đ")
  async changeMijozData(@Ctx() ctx: Context) {
    return this.appService.changeMijozData(ctx);
  }
  @Hears("Ism, Familiya âī¸")
  async changeMijozIsm(@Ctx() ctx: Context) {
    return this.appService.changeName(ctx);
  }
  @Hears("Telefon raqam đ")
  async changeMijozPhone(@Ctx() ctx: Context) {
    return this.appService.changeNumber(ctx);
  }
  @Hears("XIZMATLAR đ")
  async xizmatlar(@Ctx() ctx: Context) {
    return this.appService.onServices(ctx);
  }
  @Hears("orqaga âŠī¸")
  async goBack(@Ctx() ctx: Context) {
    return this.appService.orqaga(ctx);
  }
  @Hears("ISMI đ")
  async searchNameService(@Ctx() ctx: Context) {
    return this.appService.serachNameMijoz(ctx);
  }
  @Hears("REYTING â­ī¸")
  async searchRatingService(@Ctx() ctx: Context) {
    return this.appService.serachRatingMijoz(ctx);
  }
  @Hears("Lokatsiya đ")
  async onLocationMijoz(@Ctx() ctx: Context) {
    return this.appService.onLocationMijoz(ctx);
  }
  @Hears("TANLANGAN XIZMATLAR đĨ")
  async tanlangan_hizmatlar(@Ctx() ctx: Context) {
    return this.appService.tanlanganHizmatlar(ctx);
  }
  @Action(/^(service-\d+)/)
  async selectService(@Ctx() ctx: Context) {
    return this.appService.selectServices(ctx);
  }
  @Action(/(prevMastersName-[^c])/)
  async prevMastersName(@Ctx() ctx: Context) {
    return this.appService.onPaginationName(ctx);
  }
  @Action(/(prevMastersRating-[^c])/)
  async prevMastersRating(@Ctx() ctx: Context) {
    return this.appService.onPaginationRating(ctx);
  }
  @Action(/(prevMastersLocation-[^c])/)
  async prevMastersLocation(@Ctx() ctx: Context) {
    return this.appService.onPaginationLocation(ctx);
  }
  @Action(/(prevMastersTime-[^c])/)
  async prevMastersTime(@Ctx() ctx: Context) {
    return this.appService.onPaginationTime(ctx);
  }
  @Action(/(master-[^c])/)
  async selectMaster(@Ctx() ctx: Context) {
    return this.appService.selectMaster(ctx);
  }
  @Action(/(masterLocation-[^c])/)
  async masterLocation(@Ctx() ctx: Context) {
    return this.appService.showLocation(ctx);
  }
  @Action(/(getRank-[^c])/)
  async getRank(@Ctx() ctx: Context) {
    return this.appService.getRank(ctx);
  }
  @Action(/(day-[^c])/)
  async getTimes(@Ctx() ctx: Context) {
    return this.appService.getTimes(ctx);
  }
  @Action(/(timeSelect-[^c])/)
  async timeSelect(@Ctx() ctx: Context) {
    return this.appService.sendSmsMaster(ctx);
  }
  @Action(/(xa-[^c])/)
  async confirmYes(@Ctx() ctx: Context) {
    return this.appService.confirmMessage(ctx);
  }
  @Action(/(yo'q-[^c])/)
  async confirmNo(@Ctx() ctx: Context) {
    return this.appService.confirmMessage(ctx);
  }
  @Action("Ranking")
  async Ranking(@Ctx() ctx: Context) {
    return this.appService.toRankings(ctx);
  }
  @Action("getTimeOrder")
  async getTimeOrder(@Ctx() ctx: Context) {
    return this.appService.getDays(ctx);
  }
  @Action("goBack")
  async goBackAction(@Ctx() ctx: Context) {
    return this.appService.orqaga(ctx);
  }

  // =======
  @On("message")
  async onMessage(@Ctx() ctx: Context) {
    return this.appService.onMessage(ctx);
  }

}
