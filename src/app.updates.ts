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

  @Hears("📊 Reyting")
  async hearsRating(@Ctx() ctx: Context) {
    await this.appService.hearsRating(ctx);
  }

  @Hears("🕔 Vaqt")
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

  @Hears("🔄 Ma'lumotlarni o'zgartirish")
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

  @On("message")
  async onMessage(@Ctx() ctx: Context) {
    return this.appService.onMessage(ctx);
  }
}
