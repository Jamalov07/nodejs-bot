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

@Update()
export class AppUpdate {
  constructor(private readonly appService: AppService) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    return this.appService.onStart(ctx);
  }
  @Command("Mijoz")
  async commandMijoz(@Ctx() ctx: Context) {
    return this.appService.onMijoz(ctx);
  }
  @Hears("🤵‍♂️ Mijoz")
  async onMijoz(@Ctx() ctx: Context) {
    return this.appService.onMijoz(ctx);
  }
  @Hears("MA’LUMOTLARNI O’ZGARTIRISH 📝")
  async changeMijozData(@Ctx() ctx: Context) {
    return this.appService.changeMijozData(ctx);
  }
  @Hears("Ism, Familiya ✏️")
  async changeMijozIsm(@Ctx() ctx: Context) {
    return this.appService.changeName(ctx);
  }
  @Hears("Telefon raqam 📞")
  async changeMijozPhone(@Ctx() ctx: Context) {
    return this.appService.changeNumber(ctx);
  }
  @Hears("XIZMATLAR 📂")
  async xizmatlar(@Ctx() ctx: Context) {
    return this.appService.onServices(ctx);
  }
  @Hears("orqaga ↩️")
  async goBack(@Ctx() ctx: Context) {
    return this.appService.orqaga(ctx);
  }
  @Hears("ISMI 📝")
  async searchNameService(@Ctx() ctx: Context) {
    return this.appService.serachNameMijoz(ctx);
  }
  @Hears("REYTING ⭐️")
  async searchRatingService(@Ctx() ctx: Context) {
    return this.appService.serachRatingMijoz(ctx);
  }
  @Hears("Lokatsiya 📍")
  async onLocation(@Ctx() ctx: Context) {
    return this.appService.onLocation(ctx);
  }
  @Hears("TANLANGAN XIZMATLAR 📥")
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
  @On("location")
  async getLocation(@Ctx() ctx: Context) {
    return this.appService.getLocation(ctx);
  }
  @On("contact")
  async onContact(@Ctx() ctx: Context) {
    return this.appService.onContact(ctx);
  }

  @On("message")
  async onMessage(@Ctx() ctx: Context) {
    return this.appService.onMessage(ctx);
  }
}
