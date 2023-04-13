import { Action, Command, Ctx, Hears, On, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { AppService } from "./app.service";
import { AdminService } from "./admin.service";

@Update() 
export class AppUpdate {
  constructor(private readonly appService: AppService,
              private readonly adminService: AdminService
  ) { }
  @Command('admin')
  async enterToAdmin(@Ctx() ctx:Context){
    return this.adminService.commandAdmin(ctx);
  }

  @Hears('🧰 Xizmatlar')
  async properties(@Ctx() ctx:Context) {
    return this.adminService.showProperties(ctx);
  }

  @Hears("🧰 Xizmatlar bo'limiga qaytish")
  async reTurn(@Ctx() ctx:Context) {
    return this.adminService.showProperties(ctx);
  }
  @Hears("⏬ Xizmat qo'shish")
  async addServiceType(@Ctx() ctx:Context) {
    return this.adminService.addServiceType(ctx)
  }

  @Hears("👀 Barcha xizmatlarni ko'rish")
  async seeAllServiceTypes(@Ctx() ctx:Context) {
    return this.adminService.seeAllServiceTypes(ctx);
  }
  @Hears('🧖‍♂️ Ustalar')
  async seeMasters(@Ctx() ctx:Context){
    return this.adminService.complectMasters(ctx);
  }
  @Action('sSmsAllUser')
  async sendMessageUser(@Ctx() ctx:Context) {
    return this.adminService.sendMessageUser(ctx);
  }
  @Action(/^(fields=\d+)/)
  async hearsService(@Ctx() ctx: Context) {
    return this.adminService.hearsServiceFields(ctx);
  }

  @Action('sendAllSms')
  async sendSms(@Ctx() ctx:Context) {
    await this.adminService.sendMessageAll(ctx);
  }

  @Hears('✍️ Hamma masterlarga xabar yuborish')
  async sendSmsAll(@Ctx() ctx:Context) {
    return this.adminService.sendMessageAll(ctx);
  }

  @Hears('✍️ Hamma userlarga xabar yuborish')
  async sendSmsUser(@Ctx() ctx:Context) {
    return this.adminService.sendMessageUser(ctx);
  }
  @Action('SendAllSms')
  async sendAllSms(@Ctx() ctx:Context) {
    return this.adminService.sendMessageAll(ctx);
  }
  @Hears('🏠 Bosh menyu')
  async toMainMenu(@Ctx() ctx:Context) {
    return this.adminService.toMainMenu(ctx);
  }
  @Hears("🛠 Yo'nalishlar ro'yxatiga qaytish")
  async complectMasters(@Ctx() ctx:Context){
    return this.adminService.complectMasters(ctx);
  }
  @Action('mainmenu')
  async mMenu(@Ctx() ctx:Context) {
    return this.adminService.toMainMenu(ctx);
  }

  @Action('returntosearch')
  async ReturnToSearchUser(@Ctx() ctx:Context) {
    return this.adminService.seeUsers(ctx);
  }
  @Action(/^(delmaster=\d+)/)
  async deleteMaster(@Ctx() ctx:Context) {
    return this.adminService.deleteMaster(ctx);
  }
  @Action(/^(deactivemas=\d+)/)
  async deActiveMaster(@Ctx() ctx:Context) {
    return this.adminService.deActiveMaster(ctx);
  }
  @Action(/^(showstats=\d+)/)
  async showStats(@Ctx() ctx:Context) {
    return this.adminService.showStatics(ctx);
  }
  @Action(/^(sendmess=\d+)/)
  async sendMessageToMaster(@Ctx() ctx:Context) {
    return this.adminService.sendMessage(ctx);
  }

  @Action(/^(deletefield=\d+)/)
  async deleteField(@Ctx() ctx:Context) {
    return this.adminService.removeFields(ctx);
  }
  @Action(/^(changefield=\d+)/)
  async updateField(@Ctx() ctx:Context) {
    return this.adminService.updateFields(ctx);
  }
  @Action(/^(banuser=\d+)/)
  async banUser(@Ctx() ctx:Context) {
    return this.adminService.doBan(ctx);
  }
  @Action(/^(debanuser=\d+)/)
  async debanUser(@Ctx() ctx:Context) {
    return this.adminService.deBan(ctx);
  }

  @Action(/^(isban=\d+)/)
  async isBanUser(@Ctx() ctx:Context) {
    return this.adminService.isBan(ctx);
  }

  @Action(/^(statuser=\d+)/)
  async statsUser(@Ctx() ctx:Context) {
    return this.adminService.userStat(ctx);
  }

  @Action(/(^next=[\s\S])\w+/g)
  async nextElement(@Ctx() ctx:Context) {
    console.log("afjbasd")
    return this.adminService.nextElement(ctx);
  }
  @Action(/^(msguser=\d+)/)
  async messageToUser(@Ctx() ctx:Context) {
    return this.adminService.msgToUser(ctx);
  }
  @Hears("✔️ Userni ban qilish")
  async buttonBan(@Ctx() ctx:Context){
    return this.adminService.doBan(ctx);
  }
  @Hears("♻️ Yana qo'shish")
  async reAddNewItem(@Ctx() ctx:Context) {
    return this.adminService.reAddNewItem(ctx);
  }
  @Hears("✔️ Userni bandan yechish")
  async buttonUnBan(@Ctx() ctx:Context) {
    return this.adminService.deBan(ctx);
  }
  @Hears("👨‍⚕️ Usta yo'nalishlariga qaytish")
  async reSeeMasters(@Ctx() ctx:Context) {
    return this.adminService.complectMasters(ctx);
  }
  @Hears("🔍 Ism bo'yicha izlash")
  async searchByName(@Ctx() ctx:Context) {
    return this.adminService.searchByName(ctx);
  }
  @Hears("📱 Yana telefon raqami orqali izlash")
  async reAgainByNumber(@Ctx() ctx:Context) {
    return this.adminService.searchByNumber(ctx);
  }
  @Hears('🛂 Tahrirlash')
  async changeFields(@Ctx() ctx:Context) {
    return this.adminService.changeFields(ctx);
  }
  @Hears("🔄 Yana boshqa service typeni o'zgartirish")
  async reChangeServiceType(@Ctx() ctx:Context) {
    return this.adminService.changeFields(ctx);
  }
  @Hears("🗑 Yana boshqa service turini o'chirib tashlash")
  async reDeleteServiceType(@Ctx() ctx:Context) {
    return this.adminService.deleteFields(ctx);
  }
  @Hears("🗑 O'chirib tashlash")
  async deleteFields(@Ctx() ctx:Context) {
    return this.adminService.deleteFields(ctx);
  }
  @Hears("📱 telefon raqami bo'yicha izlash")
  async searchByNumber(@Ctx() ctx:Context) {
    return this.adminService.searchByNumber(ctx);
  }
  @Hears('🙍‍♂️ Mijozlar')
  async clients(@Ctx() ctx:Context){
    return this.adminService.seeUsers(ctx);
  }

  @Hears("🙍‍♂️ Mijozlar bo'limiga qaytish")
  async returnToUserMenu(@Ctx() ctx:Context) {
    return this.adminService.seeUsers(ctx);
  }
  @Hears("🙍‍♂️ Mijozlarni izlashda davom etish")
  async reSeeClients(@Ctx() ctx:Context) {
    return this.adminService.seeUsers(ctx);
  }

  @Hears("🙍‍♂️ Mijozlarni bo'limiga qaytish")
  async retur(@Ctx() ctx:Context) {
    return this.adminService.seeUsers(ctx);
  }

  @Action('returntosearch')
  async returnToSearch(@Ctx() ctx:Context) {
    return this.adminService.seeUsers(ctx);
  }
  @Hears('📱 Telefon raqam orqali')
  async searchUserByPhone(@Ctx() ctx:Context) {
    return this.adminService.searchUserByPhone(ctx);
  }

  @Hears('🔎 Ism orqali izlash')
  async searchByUserByName(@Ctx() ctx:Context) {
    return this.adminService.searchUserByName(ctx);
  }

  @On('message')
  async onMessage(@Ctx() ctx:Context) {
    return this.adminService.onMessage(ctx);
  }

}
