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


}
