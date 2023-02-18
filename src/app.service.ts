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
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if (user) {
    } else if (master) {
      if (master.status && master.last_state === "finish") {
        await ctx.reply("O'zingizga kerakli bo'lgan bo'limni tanlang", {
          parse_mode: "HTML",
          ...Markup.keyboard([
            ["👥 Mijozlar", "🕔 Vaqt", "📊 Reyting"],
            ["🔄 Ma'lumotlarni o'zgartirish"],
          ])
            .oneTime()
            .resize(),
        });
      }
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
        is_active: true,
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
        ...Markup.inlineKeyboard([
          ...serviceNames,
          [Markup.button.callback("❌ Bekor qilish", "delmyinfo")],
        ]),
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
          await ctx.reply("Ismingizni kiriting", {
            parse_mode: "HTML",
            ...Markup.keyboard([["❌ Bekor qilish"]])
              .oneTime()
              .resize(),
          });
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
                [Markup.button.contactRequest("📲 Raqam yuborish")],
                ["❌ Bekor qilish"],
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
              "Ish tugatish vaqtingizni kiriting. Namuna ( 21:00 )"
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
            let date =
              ctx.message.text === "00:00" ? "24:00" : ctx.message.text;
            await master.update({
              work_end_time: date,
              last_state: "time_per",
            });
            await ctx.reply(
              "Bir mijoz uchun maksimal sarflaydigan vaqtingizni minutda kiriting. Maksimal 60 minut. Namuna ( 30 )"
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
              ? `\n🏛 Ustaxona nomi: ${master.service_name}`
              : "";
            const address = master.address
              ? `\n📍 Manzili: ${master.address}`
              : "";
            const target = master.target_address
              ? `\nMo'ljal: ${master.target_address}`
              : "";
            const masterInfo = `👤 Ismi: ${master.name}\n📲 Telefon raqami: ${master.phone_number}${serviceName}${address}${target}\n🕔 Ish vaqti: ${master.work_start_time} dan - ${master.work_end_time} gacha\nBir mijoz uchun tahminan ${master.time_per_work} minut sarflaydi`;
            await ctx.reply("Shaxsiy ma'lumotlaringizni tasdiqlang");
            await ctx.reply(masterInfo, {
              parse_mode: "HTML",
              ...Markup.inlineKeyboard([
                [Markup.button.callback("✅ Tasdiqlash", `reqtoadmin`)],
                [Markup.button.callback("❌ Bekor qilish", `delmyinfo`)],
              ]),
            });
          }
        } else if (master.last_state === "send_message") {
          await ctx.telegram.forwardMessage(
            process.env.ADMIN_ID,
            master.master_id,
            ctx.message.message_id
          );
          let masterInfo = `Ismi: ${master.name}\nUsta ${master.createdAt
            .toString()
            .split(" ")
            .slice(1, 5)
            .join(" ")} da ro'yhatdan o'tgan\nHarakat: ${
            master.is_active ? "ruhsat berilgan" : "bloklangan"
          }\nHolati: ${master.status ? "tasdiqlangan" : "tasdiqlanmagan"}`;
          await ctx.telegram.sendMessage(process.env.ADMIN_ID, masterInfo, {
            parse_mode: "HTML",
            ...Markup.inlineKeyboard([
              [
                Markup.button.callback(
                  "🔓 Bloklash",
                  `blockthis=${master.master_id}`
                ),
              ],
              [
                Markup.button.callback(
                  "✅ Tasdiqlash",
                  `allowto=${master.master_id}`
                ),
              ],
            ]),
          });
          await master.update({ last_state: "finish" });
        } else if (master.last_state === "service_name") {
          await master.update({
            service_name: ctx.message.text,
            last_state: "address",
          });
          await ctx.reply("Ustaxona to'liq manzilini kiriting (ixtiyoriy)", {
            parse_mode: "HTML",
            ...Markup.keyboard([["⏭ keyingisi"], ["❌ Bekor qilish"]])
              .oneTime()
              .resize(),
          });
        } else if (master.last_state === "address") {
          await master.update({
            address: ctx.message.text,
            last_state: "target_address",
          });
          await ctx.reply("Mo'ljalni kiriting (ixtiyoriy)", {
            parse_mode: "HTML",
            ...Markup.keyboard([["⏭ keyingisi"], ["❌ Bekor qilish"]])
              .oneTime()
              .resize(),
          });
        } else if (master.last_state === "target_address") {
          await master.update({
            target_address: ctx.message.text,
            last_state: "location",
          });
          await ctx.reply("Ustaxona lokatsiyasini yuboring", {
            parse_mode: "HTML",
            ...Markup.keyboard([["❌ Bekor qilish"]])
              .oneTime()
              .resize(),
          });
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
              ...Markup.keyboard([["⏭ keyingisi"], ["❌ Bekor qilish"]])
                .oneTime()
                .resize(),
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
        await ctx.reply("Ustaxona to'liq manzilini kiriting (ixtiyoriy)", {
          parse_mode: "HTML",
          ...Markup.keyboard([["⏭ keyingisi"], ["❌ Bekor qilish"]])
            .oneTime()
            .resize(),
        });
      } else if (master.last_state === "address") {
        master.update({ last_state: "target_address" });
        await ctx.reply("Mo'ljalni kiriting (ixtiyoriy)", {
          parse_mode: "HTML",
          ...Markup.keyboard([["⏭ keyingisi"], ["❌ Bekor qilish"]])
            .oneTime()
            .resize(),
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
          await ctx.reply("Ish boshlash vaqtingizni kiriting. Namuna( 07:00 )");
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
    if (user) {
    } else if (master) {
      if (master.last_state === "finish") {
        const serviceName = master.service_name
          ? `\n🏛 Ustaxona nomi: ${master.service_name}`
          : "";
        const address = master.address ? `\n📍 Manzili: ${master.address}` : "";
        const target = master.target_address
          ? `\nMo'ljal: ${master.target_address}`
          : "";
        const masterInfo = `👤 Ismi: ${master.name}\n📲 Telefon raqami: ${master.phone_number}${serviceName}${address}${target}\n🕔 Ish vaqti: ${master.work_start_time} dan - ${master.work_end_time} gacha\nBir mijoz uchun tahminan ${master.time_per_work} minut sarflaydi`;
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

  async cancelRegistration(ctx: Context) {
    const user = await this.userRepository.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });

    if (user) {
    } else if (master) {
      await master.destroy();
      await ctx.reply("Ro'yhatdan o'tish bekor qilindi", {
        parse_mode: "HTML",
        ...Markup.keyboard([["👤 Ro'yhatdan o'tish"]])
          .oneTime()
          .resize(),
      });
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
            ["👥 Mijozlar", "🕔 Vaqt", "📊 Reyting"],
            ["🔄 Ma'lumotlarni o'zgartirish"],
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

  async noAllow(ctx: Context) {
    if (process.env.ADMIN_ID === String(ctx.from.id)) {
      if ("match" in ctx) {
        const master_id = ctx.match[0].slice(8);
        const master = await this.masterRepository.findOne({
          where: { master_id: master_id },
        });
        if (master) {
          await ctx.reply(`${master.name} masterlar ro'yhatidan o'chirildi`);
          await master.destroy();
        }
      }
    }
  }

  async toBlock(ctx: Context) {
    if (process.env.ADMIN_ID === String(ctx.from.id)) {
      if ("match" in ctx) {
        const master_id = ctx.match[0].slice(10);
        const master = await this.masterRepository.findOne({
          where: { master_id: master_id },
        });
        if (master) {
          await master.update({ is_active: false });
          await ctx.reply(`${master.name} bloklanganlar ro'yhatiga tushdi`);
        }
      }
    }
  }

  async sendMessageToAdmin(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if (master) {
      master.update({ last_state: "send_message" });
      await ctx.reply("Adminga yubormoqchi bo'lgan habaringizni yuboring");
    }
  }

  async hearsMijozlarInMaster(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if (master) {
      const clients = await this.orderRepository.findAll({
        where: {
          master_id: master.master_id,
          date: {
            [Op.gt]: new Date(),
          },
        },
      });
      console.log(clients);
      let clientsInfo = "";
      for (let i = 0; i < clients.length; i++) {
        const user = await this.userRepository.findOne({
          where: { user_id: `${clients[i].user_id}` },
        });
        if (user) {
          clientsInfo += `${i + 1}. ${clients[i].date
            .split("-")
            .slice(1)
            .reverse()
            .join(".")} - ${clients[i].time} / ${user.real_name} , ${
            user.phone_number
          }\n`;
        }
      }
      await ctx.reply(clientsInfo);
    }
  }

  async hearsRating(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if (master) {
      const rating = Math.round(master.rating);
      let str = "";
      for (let i = 0; i < rating; i++) {
        str += `🌟`;
      }
      await ctx.reply(`Umumiy reyting: ${str ? str : "🌟"}`);
    }
  }

  async hearsTime(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if (master) {
      let date = new Date();
      let weeksCount = 7;
      let inlineButtons = [];
      let timeNow = date.toTimeString().slice(0, 5);
      let dateNow = date
        .toISOString()
        .split("T")[0]
        .split("-")
        .slice(1)
        .reverse()
        .join(".");

      // console.log(timeNow);
      // console.log(dateNow);
      if (timeNow < master.work_end_time) {
        inlineButtons.push([
          Markup.button.callback(
            dateNow,
            `search=date:${date.getFullYear()}-${dateNow
              .split(".")
              .reverse()
              .join("-")}`
          ),
        ]);
        weeksCount--;
      }

      for (let i = 0; i < weeksCount; i++) {
        let nextDate = new Date(date.setDate(date.getDate() + 1))
          .toISOString()
          .split("T")[0]
          .split("-")
          .slice(1)
          .reverse()
          .join(".");
        inlineButtons.push([
          Markup.button.callback(
            nextDate,
            `search=date:${date.getFullYear()}-${nextDate
              .split(".")
              .reverse()
              .join("-")}`
          ),
        ]);
      }

      await ctx.reply("Kunni tanlang", {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([...inlineButtons]),
      });
      // console.log(...inlineButtons);
    }
  }

  async actionSearchForDay(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if ("match" in ctx) {
      if (master) {
        // console.log(ctx);
        const message = ctx.match["input"];
        const dateMatch = message.split("=")[1].split(":")[1];
        let dateNow = new Date().toISOString().split("T")[0];
        let timeNow = new Date().toISOString().split("T")[1].slice(0, 5);
        console.log(timeNow);
        console.log(dateMatch);
        console.log(dateNow);
        let orders;
        if (dateNow === dateMatch) {
          orders = await this.orderRepository.findAll({
            where: {
              master_id: master.master_id,
              date: dateMatch,
              time: {
                [Op.gt]: timeNow,
              },
            },
          });
        } else {
          orders = await this.orderRepository.findAll({
            where: {
              master_id: master.master_id,
              date: dateMatch,
            },
          });
        }
        let orderTimes = [];
        for (let i = 0; i < orders.length; i++) {
          orderTimes.push(orders[i].time);
        }
        console.log(orderTimes);
        // console.log(orders);
        let time = master.work_start_time;
        // console.log(time, master.work_end_time);
        let inlineKeyboards = [];
        while (parseInt(time) < parseInt(master.work_end_time)) {
          if (dateNow === dateMatch) {
            if (parseInt(time) > parseInt(timeNow)) {
              if (orderTimes.includes(time)) {
                for (let i = 0; i < orders.length; i++) {
                  if (orders[i].time === time) {
                    inlineKeyboards.push(
                      Markup.button.callback(
                        `❌ ${time}`,
                        `bookwithuser:id=${orders[i].user_id}-date=${dateMatch}-time=${time}`
                      )
                    );
                  }
                }
              } else {
                inlineKeyboards.push(
                  Markup.button.callback(
                    `${time}`,
                    `booking:date=${dateMatch}-time=${time}`
                  )
                );
              }
            }
          } else {
            if (orderTimes.includes(time)) {
              for (let i = 0; i < orders.length; i++) {
                if (orders[i].time === time) {
                  inlineKeyboards.push(
                    Markup.button.callback(
                      `❌ ${time}`,
                      `bookwithuser:id=${orders[i].user_id}-date=${dateMatch}-time=${time}`
                    )
                  );
                }
              }
            } else {
              inlineKeyboards.push(
                Markup.button.callback(
                  `${time}`,
                  `booking:date=${dateMatch}-time=${time}`
                )
              );
            }
          }
          let minut = +time.split(":")[1];
          let hour = +time.split(":")[0];
          minut = minut + +master.time_per_work;
          // console.log(minut);
          if (minut >= 60) {
            minut = minut - 60;
            time = `${+hour + 1 < 10 ? `0${hour + 1}` : hour + 1}:${
              minut ? minut : `00`
            }`;
          } else {
            time = `${hour < 10 ? `0${hour}` : hour}:${minut ? minut : `00`}`;
          }
          console.log(time);
        }
        console.log(inlineKeyboards);
        let buttons = [];
        let mainKeyboard = [];
        for (let i = 0; i < inlineKeyboards.length; i++) {
          buttons.push(inlineKeyboards[i]);
          if (buttons.length == 5) {
            mainKeyboard.push(buttons);
            buttons = [];
          }
        }
        if (buttons.length) {
          mainKeyboard.push(buttons);
          buttons = [];
        }
        console.log(...mainKeyboard);
        await ctx.reply("Siz tanlagan kunning umumiy vaqtlari ro'yhati", {
          parse_mode: "HTML",
          ...Markup.inlineKeyboard([...mainKeyboard]),
        });
      }
    }
  }
}
