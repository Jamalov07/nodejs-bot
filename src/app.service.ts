import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { InjectBot } from "nestjs-telegraf";
import { Context, Markup, Telegraf } from "telegraf";
import { MyBotName } from "./app.constants";
import { User } from "./models/user.model";
import sequelize from "sequelize";
import { Op } from "sequelize";
import { Service_type } from "./models/service_type.model";
import { Master } from "./models/master.model";
import { Order } from "./models/order.model";
import { services } from "./helpers/services";

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Service_type) private serviceRepository: typeof Service_type,
    @InjectModel(Master) private masterRepository: typeof Master,
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectBot(MyBotName) private readonly bot: Telegraf<Context>
  ) {}

  async onStart(ctx: Context) {
    const user = await this.userRepository.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
    } else {
      await ctx.reply(
        "Assalomu alaykum. Hush kelibsiz, botdan birinchi martda foydalanayotganingiz uchun ro'yhatdan o'tishingiz lozim",
        {
          parse_mode: "HTML",
          ...Markup.keyboard([["👤 Ro'yhatdan o'tish"]])
            .oneTime()
            .resize(),
        }
      );
    }
  }

  async registration(ctx: Context) {
    const user = await this.userRepository.findOne({
      where: { user_id: `${ctx.from.id}` },
    });

    if (user) {
      //
    } else {
      await ctx.reply("Kim bo'lib ro'yhatdan o'tasiz?", {
        parse_mode: "HTML",
        ...Markup.keyboard([["👨‍🚀 Usta", "🤵‍♂️ Mijoz"]])
          .oneTime()
          .resize(),
      });
    }
  }

  async hearsMaster(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if (master) {
      //
    } else {
      await this.masterRepository.create({
        master_id: `${ctx.from.id}`,
        status: false,
        rating: 0,
        last_state: "service_type",
      });

      const services = await this.serviceRepository.findAll();
      let serviceNames = [];
      for (let i = 0; i < services.length; i++) {
        serviceNames.push([
          Markup.button.callback(
            services[i].name,
            `thisservice=${services[i].id}`
          ),
        ]);
      }
      await ctx.reply("O'zingizning sohangizni tanlang", {
        ...Markup.inlineKeyboard([...serviceNames]),
      });
    }
  }

  async hearsServiceTypes(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if ("match" in ctx) {
      if (master && master.last_state === "service_type") {
        const id = ctx.match[0].slice(12);
        const service = await this.serviceRepository.findOne({
          where: { id: id },
        });
        if (service) {
          await master.update({ service_id: service.id, last_state: "name" });
          await ctx.reply("Ismingizni kiriting");
        }
      } else {
        await ctx.reply("/start");
      }
    }
  }

  async onMessage(ctx: Context) {
    const user = await this.userRepository.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if ("text" in ctx.message) {
      if (user) {
      } else if (master) {
        if (master.last_state === "name") {
          await master.update({
            name: ctx.message.text,
            last_state: "phone_number",
          });
          await ctx.reply(
            "Siz bilan bog'lanish uchun 📲 Raqam yuborish tugmasini bosing",
            {
              parse_mode: "HTML",
              ...Markup.keyboard([
                Markup.button.contactRequest("📲 Raqam yuborish"),
              ])
                .oneTime()
                .resize(),
            }
          );
        } else if (master.last_state === "work_start_time") {
          let time = ctx.message.text.split(":");
          if (
            +time.join("") <= 2400 &&
            ctx.message.text.length == 5 &&
            +time[0] <= 24 &&
            +time[1] <= 59
          ) {
            await master.update({
              work_start_time: ctx.message.text,
              last_state: "work_end_time",
            });
            await ctx.reply(
              "Ish tugatish vaqtingizni kiriting. Namuna (`21:00`)"
            );
          } else {
            await ctx.reply("Vaqtni ko'rsatilgan namunadek kiriting");
          }
        } else if (master.last_state === "work_end_time") {
          let time = ctx.message.text.split(":");
          if (
            +time.join("") <= 2400 &&
            ctx.message.text.length == 5 &&
            +time[0] <= 24 &&
            +time[1] <= 59
          ) {
            await master.update({
              work_start_time: ctx.message.text,
              last_state: "time_per",
            });
            await ctx.reply(
              "Bir mijoz uchun maksimal sarflaydigan vaqtingizni minutda kiriting. maksimal 1 soat Namuna (`30`)"
            );
          } else {
            await ctx.reply("Vaqtni ko'rsatilgan namunadek kiriting");
          }
        } else if (master.last_state === "time_per") {
          if (+ctx.message.text <= 60 && +ctx.message.text != 0) {
            await master.update({
              time_per_work: ctx.message.text,
              last_state: "finish",
            });
            const serviceName = master.service_name
              ? `\nUstaxona nomi: ${master.service_name}`
              : "";
            const address = master.address
              ? `\nManzili: ${master.address}`
              : "";
            const target = master.target_address
              ? `\nMo'ljal: ${master.target_address}`
              : "";
            const masterInfo = `Ismi: ${master.name}\nTelefon raqami: ${master.phone_number}${serviceName}${address}${target}`;
            await ctx.reply("Shaxsiy ma'lumotlaringizni tasdiqlang");
            await ctx.reply(masterInfo, {
              parse_mode: "HTML",
              ...Markup.inlineKeyboard([
                [Markup.button.callback("✅ Tasdiqlash", `reqtoadmin`)],
                [Markup.button.callback("❌ Bekor qilish", `delmyinfo`)],
              ]),
            });
          }
        }
      }
    }
  }

  async onContact(ctx: Context) {
    const user = await this.userRepository.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if ("contact" in ctx.message) {
      if (user) {
        //
      } else if (master) {
        if (master.last_state === "phone_number") {
          if (ctx.from.id == ctx.message.contact.user_id) {
            await master.update({
              phone_number: ctx.message.contact.phone_number,
              last_state: "service_name",
            });
            await ctx.reply("Ustaxona nomi bo'lsa kiriting (ixtiyoriy)", {
              parse_mode: "HTML",
              ...Markup.keyboard(["⏭ keyingisi"]).oneTime().resize(),
            });
          }
        }
      }
    }
  }

  async hearsNext(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if (master) {
      if (master.last_state === "service_name") {
        master.update({ last_state: "address" });
        await ctx.reply("Ustaxona to'liq manzilini kiriting", {
          parse_mode: "HTML",
          ...Markup.keyboard(["⏭ keyingisi"]).oneTime().resize(),
        });
      } else if (master.last_state === "address") {
        master.update({ last_state: "target_address" });
        await ctx.reply("Mo'lljalni kiriting", {
          parse_mode: "HTML",
          ...Markup.keyboard(["⏭ keyingisi"]).oneTime().resize(),
        });
      } else if (master.last_state === "target_address") {
        master.update({ last_state: "location" });
        await ctx.reply("Ustaxona lokatsiyasini yuboring");
      }
    }
  }

  async onLocation(ctx: Context) {
    const user = await this.userRepository.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if ("location" in ctx.message) {
      if (user) {
        //
      } else if (master) {
        if (master.last_state === "location") {
          master.update({
            location: `${ctx.message.location.latitude},${ctx.message.location.latitude}`,
            last_state: "work_start_time",
          });
          await ctx.reply("Ish boshlash vaqtingizni kiriting. Namuna(`07:00`)");
        }
      }
    }
  }

  async requestToAdmin(ctx: Context) {
    const user = await this.userRepository.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if ("match" in ctx) {
      if (user) {
      } else if (master) {
        if (master.last_state === "finish") {
          const serviceName = master.service_name
            ? `\nUstaxona nomi: ${master.service_name}`
            : "";
          const address = master.address ? `\nManzili: ${master.address}` : "";
          const target = master.target_address
            ? `\nMo'ljal: ${master.target_address}`
            : "";
          const masterInfo = `Ismi: ${master.name}\nTelefon raqami: ${master.phone_number}${serviceName}${address}${target}`;

          await ctx.telegram.sendMessage(process.env.ADMIN_ID, masterInfo, {
            parse_mode: "HTML",
            ...Markup.inlineKeyboard([
              [
                Markup.button.callback(
                  "✅ Tasdiqlash",
                  `allowto=${master.master_id}`
                ),
              ],
              [
                Markup.button.callback(
                  "❌ Bekor qilish",
                  `noallow=${master.master_id}"`
                ),
              ],
            ]),
          });

          await ctx.reply(
            "Sizning so'rov adminga yuborildi. Holatingizni tekshirib turing",
            {
              parse_mode: "HTML",
              ...Markup.keyboard([
                ["ℹ️ Tekshirish", "❌ Bekor qilish"],
                ["✍️ Admin bilan bog'lanish"],
              ])
                .oneTime()
                .resize(),
            }
          );
        }
      }
    }
  }

  async cancelRegistration(ctx: Context) {
    const user = await this.userRepository.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if ("match" in ctx) {
      if (user) {
      } else if (master) {
        await master.destroy();
      }
    }
  }

  async confirmInAdmin(ctx: Context) {
    if (process.env.ADMIN_ID === String(ctx.from.id)) {
      if ("match" in ctx) {
        const master_id = ctx.match[0].slice(8);
        const master = await this.masterRepository.findOne({
          where: { master_id: master_id },
        });
        if (master) {
          await master.update({ status: true });
          await ctx.reply(`${master.name} ning holati faollashtirildi`);
        }
      }
    }
  }

  async checkStatusMaster(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if (master) {
      if (master.status) {
        await ctx.reply("O'zingizga kerakli bo'lgan bo'limni tanlang", {
          parse_mode: "HTML",
          ...Markup.keyboard([
            ["Mijozlar", "Vaqt", "Reyting"],
            ["Ma'lumotlarni o'zgartirish"],
          ])
            .oneTime()
            .resize(),
        });
      } else {
        await ctx.reply("So'rovingiz tasdiqlanishi kutilmoqda", {
          parse_mode: "HTML",
          ...Markup.keyboard([
            ["ℹ️ Tekshirish", "❌ Bekor qilish"],
            ["✍️ Admin bilan bog'lanish"],
          ])
            .oneTime()
            .resize(),
        });
      }
    }
  }
}
