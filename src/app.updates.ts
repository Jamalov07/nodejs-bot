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
  @Action('mainmenu')
  async mMenu(@Ctx() ctx:Context) {
    return this.adminService.toMainMenu(ctx);
  }
  @Hears("♻️ Yana qo'shish")
  async reAddNewItem(@Ctx() ctx:Context) {
    return this.adminService.reAddNewItem(ctx);
  }

  @Hears("🔍 Ism bo'yicha izlash")
  async searchByName(@Ctx() ctx:Context) {
    return this.adminService.searchByName(ctx);
  }
  @Hears("📱 telefon raqami bo'yicha izlash")
  async searchByNumber(@Ctx() ctx:Context) {
    return this.adminService.searchByNumber(ctx);
  }
  @On('message')
  async onMessage(@Ctx() ctx:Context) {
    return this.adminService.onMessage(ctx);
  }

}
