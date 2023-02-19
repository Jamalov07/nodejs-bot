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
  @Hears("MIJOZ 👤")
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
  @Action(/^(service-\d+)/)
  async selectService(@Ctx() ctx: Context) {
    console.log("salom");
    return this.appService.selectServices(ctx);
  }
  @Action(/(prevMastersName-[^c])/)
  async prevMastersName(@Ctx() ctx: Context) {
    console.log("salom");
    return this.appService.onPaginationName(ctx);
  }
  @Action(/(prevMastersRating-[^c])/)
  async prevMastersRating(@Ctx() ctx: Context) {
    console.log("salom");
    return this.appService.onPaginationRating(ctx);
  }
  @Action(/(prevMastersLocation-[^c])/)
  async prevMastersLocation(@Ctx() ctx: Context) {
    console.log("salom");
    return this.appService.onPaginationLocation(ctx);
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
