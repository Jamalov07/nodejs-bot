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

  @Hears('🏠 Bosh menyu')
  async toMainMenu(@Ctx() ctx:Context) {
    return this.adminService.toMainMenu(ctx);
  }

  @Hears("♻️ Yana qo'shish")
  async reAddNewItem(@Ctx() ctx:Context) {
    return this.adminService.reAddNewItem(ctx);
  }
  @On('message')
  async onMessage(@Ctx() ctx:Context) {
    return this.adminService.onMessage(ctx);
  }

}
