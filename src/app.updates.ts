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
  @Hears("⏬ Xizmat qo'shish")
  async addServiceType(@Ctx() ctx:Context) {
    return this.adminService.addServiceType(ctx)
  }

  @Hears('🧖‍♂️ Ustalar')
  async seeMasters(@Ctx() ctx:Context){
    return this.adminService.seeMasters(ctx);
  }

  @Action(/^(fields=\d+)/)
  async hearsService(@Ctx() ctx: Context) {
    return this.adminService.hearsServiceFields(ctx);
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
  @Hears("♻️ Yana qo'shish")
  async reAddNewItem(@Ctx() ctx:Context) {
    return this.adminService.reAddNewItem(ctx);
  }

  @Hears("🔍 Ism bo'yicha izlash")
  async searchByName(@Ctx() ctx:Context) {
    return this.adminService.searchByName(ctx);
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
