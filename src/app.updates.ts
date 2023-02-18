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
import { AppService } from "./app.service";
import { services } from "./helpers/services";

@Update()
export class AppUpdate {
  constructor(private readonly appService: AppService) {}
  @Start()
  async onStart(@Ctx() ctx: Context) {
    return this.appService.onStart(ctx);
  }

  @Hears("👤 Ro'yhatdan o'tish")
  async registrtion(@Ctx() ctx: Context) {
    return this.appService.registration(ctx);
  }

  @Hears("👨‍🚀 Usta")
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

  @Hears("⏭ keyingisi")
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

  @Hears("ℹ️ Tekshirish")
  async checkStatus(@Ctx() ctx: Context) {
    return this.appService.checkStatusMaster(ctx);
  }

  @Hears("✍️ Admin bilan bog'lanish")
  async sendMessage(@Ctx() ctx: Context) {
    return this.appService.sendMessageToAdmin(ctx);
  }

  @Hears("❌ Bekor qilish")
  async cancelRegistration(@Ctx() ctx: Context) {
    await this.appService.cancelRegistration(ctx);
  }

  @Hears("👥 Mijozlar")
  async hearsClients(@Ctx() ctx: Context) {
    await this.appService.hearsMijozlarInMaster(ctx);
  }

  @On("message")
  async onMessage(@Ctx() ctx: Context) {
    return this.appService.onMessage(ctx);
  }
}
