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
import { Admin } from "./models/admin.model";
import { getterServices } from "./helpers/getServices";
import { returnMenuForUser } from "./helpers/returnMenuForUser";
import { AdminService } from "./admin.service";
import { boshMenu } from "./helpers/boshMenu";
import {
  change_mijoz_ism,
  mijoz_ism,
  search_mijoz_ism,
} from "./helpers/mijoz_ism";
import { change_mijoz_phone, mijoz_phone } from "./helpers/mijoz_phone";
import { mainMijoz } from "./helpers/main_mijoz";
import {
  change_mijoz_data,
  select_service_data,
} from "./helpers/changeMijozData";

import {
  searchMasterName,
  searchMasterNameFirst,
} from "./helpers/searchMasterName";
import {
  searchMasterRating,
  searchMasterRatingFirst,
} from "./helpers/searchRatingMaster";
import {
  search_mijoz_location,
  show_mijoz_location,
  show_mijoz_locationsFirst,
} from "./helpers/searchMasterLocation";
import { getDistance } from "./helpers/distance";
import { select_master } from "./helpers/selectMaster";
import { Ranking } from "./models/ranking.model";
import { ranking_master } from "./helpers/toRanking";
import { getSevenDeys } from "./helpers/getSevenDays";
import { get_times } from "./helpers/getTime";
import {
  tima_pagination,
  tima_paginationsFirst,
} from "./helpers/timePagination";
import { tanlangan_hizmatlar } from "./helpers/tanlanganHizmatlar";
import { sendSMSMaster } from "./helpers/sendMasterSms";
import { services_mijoz } from "./helpers/services";

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Service_type) private serviceRepository: typeof Service_type,
    @InjectModel(Master) private masterRepository: typeof Master,
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectModel(Admin) private adminRepository: typeof Admin,
    @InjectModel(Ranking) private rankingRepository: typeof Ranking,
    @InjectBot(MyBotName) private readonly bot: Telegraf<Context>
  ) {}

  async onStart(ctx: Context) {
    const user = await this.userRepository.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if (user && !master) {
      return await boshMenu(ctx);
    } else if (master && !user) {
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

  // async onStart(ctx: Context) {
  //   return await boshMenu(ctx);
  // }

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
    const admin = await this.adminRepository.findOne({
      where: {
        admin_id: String(ctx.from.id),
      },
    });
    if ("text" in ctx.message) {
      if (user) {
        if (user.last_state === "register_mijoz") {
          user.real_name = ctx.message.text;
          user.last_state = "contact_mijoz";
          await user.save();
          mijoz_phone(ctx);
        } else if (user.last_state === "change_mijoz_name") {
          user.real_name = ctx.message.text;
          user.last_state = "change_mijoz";
          await user.save();
          ctx.reply(
            "Ism muvaffaqiyatli o'zgardi ✅, O'zgartirmoqchi bo'lgan ma'lumotingizni tanlang",
            {
              parse_mode: "HTML",
              ...Markup.keyboard([
                ["Ism, Familiya ✏️"],
                ["Telefon raqam 📞"],
                ["orqaga ↩️"],
              ]).resize(),
            }
          );
        } else if (user.last_state === "searchNameService") {
          const searchName = ctx.message.text;
          user.paginationCount = 0;
          user.searchName = searchName;
          await user.save();
          await searchMasterNameFirst(ctx, user, this.masterRepository);
        }
      }
      if (master) {
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
        } else if (master.last_state === "change_name") {
          await master.update({ name: ctx.message.text, last_state: "finish" });
          await ctx.reply(`Ismingiz ${ctx.message.text} ga o'zgartirildi`);
        } else if (master.last_state === "change_phone") {
          if (!isNaN(+ctx.message.text) && ctx.message.text.length == 12) {
            await master.update({
              phone_number: ctx.message.text,
              last_state: "finish",
            });
            await ctx.reply(`Raqamingiz ${ctx.message.text} ga o'zgartirildi`);
          }
        } else if (master.last_state === "change_service_name") {
          await master.update({
            service_name: ctx.message.text,
            last_state: "finish",
          });
          await ctx.reply(`Ustaxona nomi ${ctx.message.text} ga o'zgartirildi`);
        } else if (master.last_state === "change_address") {
          await master.update({
            address: ctx.message.text,
            last_state: "finish",
          });
          await ctx.reply(`Manzil ${ctx.message.text} ga o'zgartirildi`);
        } else if (master.last_state === "change_target") {
          await master.update({
            target_address: ctx.message.text,
            last_state: "finish",
          });
          await ctx.reply(`Mo'ljal ${ctx.message.text} ga o'zgartirildi`);
        } else if (master.last_state === "change_start_time") {
          let time = ctx.message.text.split(":");
          if (
            +time.join("") <= 2400 &&
            ctx.message.text.length == 5 &&
            +time[0] <= 24 &&
            +time[1] <= 59
          ) {
            await master.update({
              work_start_time: ctx.message.text,
              last_state: "finish",
            });
            await ctx.reply(
              `Ochilish vaqti ${ctx.message.text} ga o'zgartirildi`
            );
          } else {
            await ctx.reply("Vaqtni ko'rsatilgan namunadek kiriting");
          }
        } else if (master.last_state === "change_end_time") {
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
              last_state: "finish",
            });
            await ctx.reply(
              `Yopilish vaqti ${ctx.message.text} ga o'zgartirildi`
            );
          } else {
            await ctx.reply("Vaqtni ko'rsatilgan namunadek kiriting");
          }
        } else if (master.last_state === "change_time_per_work") {
          if (
            !isNaN(+ctx.message.text) &&
            +ctx.message.text < 60 &&
            +ctx.message.text != 0
          ) {
            await master.update({
              time_per_work: ctx.message.text,
              last_state: "finish",
            });
            await ctx.reply(
              `Bir mijoz uchun sarflanadigan vaqt ${ctx.message.text} minut ga o'zgartirildi`
            );
          } else {
            await ctx.reply("Ko'rsatilgan namunadek kiriting");
          }
        }
      } else if (admin) {
        if (admin.last_state == "addnewService") {
          if ("text" in ctx.message) {
            const check = await this.serviceRepository.findOne({
              where: {
                name: `${ctx.message.text}`,
              },
            });
            const services = await this.serviceRepository.findAll();
            if (check) {
              await getterServices(services, ctx);
              await ctx.reply("<b>Bunday nomli xizmat mavjud !</b>", {
                parse_mode: "HTML",
                ...Markup.keyboard([
                  [
                    "♻️ Yana qo'shish",
                    "🏠 Bosh menyu",
                    "🧰 Xizmatlar bo'limiga qaytish",
                  ],
                ])
                  .oneTime()
                  .resize(),
              });
            } else {
              await this.serviceRepository.create({
                name: String(ctx.message.text),
              });
              const nServices = await this.serviceRepository.findAll();
              admin.last_state = "finish";
              await admin.save();
              await getterServices(nServices, ctx);
              await ctx.reply("<b>Muvaffaqiyatli qoshildi !</b>", {
                parse_mode: "HTML",
                ...Markup.keyboard([
                  [
                    "♻️ Yana qo'shish",
                    "🏠 Bosh menyu",
                    "🙍‍♂️ Mijozlar bo'limiga qaytish",
                  ],
                ])
                  .oneTime()
                  .resize(),
              });
            }
          }
        } else if (admin.last_state === "searchbynamemaster") {
          if ("text" in ctx.message) {
            const data = await this.masterRepository.findOne({
              where: {
                name: `${ctx.message.text}`,
                service_id: admin.search_master_state,
                status: true,
              },
            });
            if (data) {
              await this.adminRepository.update(
                {
                  last_state: "finish",
                },
                {
                  where: {
                    admin_id: `${ctx.from.id}`,
                  },
                }
              );
              await ctx.reply(
                `Ismi: <b>${data.name}</b>\naddress:<b>${data.address}</b>\nrating:<b>${data.rating}</b>\ntelefon raqami:<b>${data.phone_number}</b>\nxizmat narxi:<b>${data.price}</b>`,
                {
                  parse_mode: "HTML",
                  ...Markup.inlineKeyboard([
                    [
                      Markup.button.callback(
                        "❌ Ustani o'chirish",
                        `delmaster=${data.master_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "✔️ Ustani aktiv emas qilib qo'yish",
                        `deactivemas=${data.master_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "📊 Statistikani ko'rish",
                        `showstats=${data.master_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "📝 Ustaga reklama yoki xabar yuborish",
                        `sendmess=${data.master_id}`
                      ),
                    ],
                    [Markup.button.callback("🏠 Bosh menyu", "mainmenu")],
                  ]),
                }
              );
            } else {
              admin.search_master_state = 0;
              admin.last_state = "finish";
              await admin.save();
              await ctx.replyWithHTML(
                `<b>Ushbu yo'nalishda bunday nomli usta yo'q</b>`
              );
              await this.complectMasters(ctx);
            }
          }
        } else if (admin.last_state === "searchbynumbermaster") {
          if ("text" in ctx.message) {
            const data = await this.masterRepository.findOne({
              where: {
                phone_number: ctx.message.text,
                service_id: admin.search_master_state,
                status: true,
              },
            });
            if (data) {
              await ctx.reply(
                `Ismi: <b>${data.name}</b>\naddress:<b>${data.address}</b>\nrating:<b>${data.rating}</b>\ntelefon raqami:<b>${data.phone_number}</b>\nxizmat narxi:<b>${data.price}</b>`,
                {
                  parse_mode: "HTML",
                  ...Markup.inlineKeyboard([
                    [
                      Markup.button.callback(
                        "❌ Ustani o'chirish",
                        `delmaster=${data.master_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "✔️ Ustani aktiv emas qilib qo'yish",
                        `deactivemas=${data.master_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "📊 Statistikani ko'rish",
                        `showstats=${data.master_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "📝 Ustaga reklama yoki xabar yuborish",
                        `sendmess=${data.master_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "✍️ Hammaga xabar yuborish",
                        "sendAllSms"
                      ),
                    ],
                    [Markup.button.callback("🏠 Bosh menyu", "mainmenu")],
                  ]),
                }
              );
            } else {
              admin.search_master_state = 0;
              admin.last_state = "finish";
              await admin.save();
              await ctx.reply(
                `<b>Ushbu yo'nalishda bunday raqamli usta yo'q</b>`,
                {
                  parse_mode: "HTML",
                  ...Markup.keyboard([
                    "🏠 Bosh menyu",
                    "👨‍⚕️ Usta yo'nalishlariga qaytish",
                    "📱 Yana telefon raqami orqali izlash",
                  ])
                    .oneTime()
                    .resize(),
                }
              );
            }
          }
        } else if (admin.last_state == "sendMessage") {
          if ("text" in ctx.message) {
            await ctx.telegram.sendMessage(
              admin.target_user_id,
              `<b>Xurmatli mutahassis! Sizga admin tomonidan xabar yuborildi</b>:\n${ctx.message.text}`,
              {
                parse_mode: "HTML",
              }
            );
            await ctx.reply("✍️ Ustaga xabaringiz yuborildi");
            await this.complectMasters(ctx);
          }
        } else if (admin.last_state == "updatefield") {
          if ("text" in ctx.message) {
            await this.serviceRepository.update(
              {
                name: String(ctx.message.text),
              },
              {
                where: {
                  id: admin.target_service_type_id,
                },
              }
            );
            const service = await this.serviceRepository.findAll();
            await getterServices(service, ctx);
            admin.last_state = "finish";
            await admin.save();
            await ctx.reply(
              "Muvvafiqatli ozgartirildi !\n Davom etish uchun quyidagi buttonlardan birini tanlang",
              {
                parse_mode: "HTML",
                ...Markup.keyboard([
                  "🔄 Yana boshqa service typeni o'zgartirish",
                  "🏠 Bosh menyu",
                ])
                  .oneTime()
                  .resize(),
              }
            );
          }
        } else if (admin.last_state == "userbyname") {
          if ("text" in ctx.message) {
            const oldUser = await this.userRepository.findAll({
              where: {
                real_name: {
                  [Op.iLike]: `%${ctx.message.text}%`,
                },
              },
              offset: 0,
            });
            const allUsers = await this.userRepository.findAll({
              where: {
                real_name: {
                  [Op.iLike]: `%${ctx.message.text}%`,
                },
              },
              limit: 1,
              offset: 0,
            });
            console.log(oldUser.length);
            if (oldUser.length == 1) {
              await ctx.reply(
                `Ismi:${allUsers[0].real_name}\nTelefon raqami:${allUsers[0].phone_number}`,
                {
                  parse_mode: "HTML",
                  ...Markup.inlineKeyboard([
                    [
                      Markup.button.callback(
                        "❌ Mijozni ban qilish",
                        `banuser=${allUsers[0].user_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "☑️ Mijozni ban dan yechish",
                        `debanuser=${allUsers[0].user_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "✔️ Mijozni ban yoki ban emasligini tekshirish",
                        `isban=${allUsers[0].user_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "📊 User haqida statistika chiqarish",
                        `statuser=${allUsers[0].user_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "✍️ Mijozga sms yuborish",
                        `msguser=${allUsers[0].user_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "🏠 User izlashga qaytish",
                        "returntosearch"
                      ),
                    ],
                  ]),
                }
              );
            } else if (oldUser.length < 1) {
              await returnMenuForUser(ctx, "<b>Bunday nomli user yoq</b>");
            } else {
              const listIndicator = [];
              if (1 > 1) {
                listIndicator.push(
                  Markup.button.callback("⏮ Oldingi", `prev=${0}`)
                );
              }
              if (0 + 1 < oldUser.length) {
                listIndicator.push(
                  Markup.button.callback(
                    "⏭ Keyingisi",
                    `next=${ctx.message.text}=${0 + 1}`
                  )
                );
              }
              await ctx.replyWithHTML(`<b>Bunday ismli user ko'p</b>`);
              await ctx.reply(
                `Ismi:${allUsers[0].real_name}\nTelefon raqami:${allUsers[0].phone_number}`,
                {
                  parse_mode: "HTML",
                  ...Markup.inlineKeyboard([
                    [
                      Markup.button.callback(
                        "❌ Mijozni ban qilish",
                        `banuser=${allUsers[0].user_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "☑️ Mijozni ban dan yechish",
                        `debanuser=${allUsers[0].user_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "✔️ Mijozni ban yoki ban emasligini tekshirish",
                        `isban=${allUsers[0].user_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "📊 User haqida statistika chiqarish",
                        `statuser=${allUsers[0].user_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "✍️ Mijozga sms yuborish",
                        `msguser=${allUsers[0].user_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "🏠 User izlashga qaytish",
                        "returntosearch"
                      ),
                    ],
                    listIndicator,
                  ]),
                }
              );
            }
          }
        } else if (admin.last_state == "sendAllMasters") {
          const masters = await this.masterRepository.findAll();
          await this.adminRepository.update(
            {
              last_state: "finish",
            },
            {
              where: {
                admin_id: `${ctx.from.id}`,
              },
            }
          );
          if ("text" in ctx.message) {
            for (let x of masters) {
              await ctx.telegram.sendMessage(
                `${x.master_id}`,
                `<b>Xurmatli mutahassis! Admin tomonidan sizga xabar yuborildi</b>:\n ${ctx.message.text}`,
                {
                  parse_mode: "HTML",
                }
              );
            }
            await ctx.reply("Xabaringiz jonatildi", {
              parse_mode: "HTML",
              ...Markup.inlineKeyboard([
                [Markup.button.callback("🏠 Bosh menu", "mainmenu")],
              ]),
            });
          }
        } else if (admin.last_state == "sendsmstouser") {
          const users = await this.userRepository.findAll();
          await this.adminRepository.update(
            {
              last_state: "finish",
            },
            {
              where: {
                admin_id: `${ctx.from.id}`,
              },
            }
          );
          if ("text" in ctx.message) {
            for (let x of users) {
              await ctx.telegram.sendMessage(
                `${x.user_id}`,
                `<b>Xurmatli foydalanuvchi! Admin tomonidan sizga xabar yuborildi</b>:\n ${ctx.message.text}`,
                {
                  parse_mode: "HTML",
                }
              );
            }
            await ctx.reply("Xabaringiz jonatildi", {
              parse_mode: "HTML",
              ...Markup.inlineKeyboard([
                [Markup.button.callback("🏠 Bosh menu", "mainmenu")],
              ]),
            });
          }
        } else if (admin.last_state == "userbyphone") {
          if ("text" in ctx.message) {
            const oneUser = await this.userRepository.findOne({
              where: {
                phone_number: `${ctx.message.text}`,
              },
            });
            if (oneUser) {
              await ctx.reply(
                `<b>Ma'lumotlar</b>:\n<b>Userning ismi</b>:${oneUser.real_name}\n<b>Userning telefon raqami</b>:${oneUser.phone_number}\n`,
                {
                  parse_mode: "HTML",
                  ...Markup.inlineKeyboard([
                    [
                      Markup.button.callback(
                        "❌ Mijozni ban qilish",
                        `banuser=${oneUser.user_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "☑️ Mijozni ban dan yechish",
                        `debanuser=${oneUser.user_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "✔️ Mijozni ban yoki ban emasligini tekshirish",
                        `isban=${oneUser.user_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "📊 User haqida statistika chiqarish",
                        `statuser=${oneUser.user_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "✍️ Mijozga sms yuborish",
                        `msguser=${oneUser.user_id}`
                      ),
                    ],
                    [
                      Markup.button.callback(
                        "🏠 User izlashga qaytish",
                        "returntosearch"
                      ),
                    ],
                  ]),
                }
              );
            } else {
              await ctx.reply("Bunday raqamli user topilmadi", {
                parse_mode: "HTML",
                ...Markup.keyboard([
                  "🏠 Bosh menyu",
                  "🙍‍♂️ Mijozlarni izlashda davom etish",
                ])
                  .oneTime()
                  .resize(),
              });
            }
          }
        } else if (admin.last_state == "sendmsguser") {
          const admin = await this.adminRepository.findOne({
            where: {
              admin_id: `${ctx.from.id}`,
            },
          });
          console.log(admin.target_user_id);
          if ("text" in ctx.message) {
            await ctx.telegram.sendMessage(
              admin.target_user_id,
              ctx.message.text
            );
            await this.adminRepository.findOne({
              where: {
                last_state: "finish",
              },
            });
            await returnMenuForUser(
              ctx,
              "<b> Xabaringiz userga yuborildi! </b>"
            );
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
        if (user.last_state === "contact_mijoz") {
          user.phone_number = String(ctx.message.contact.phone_number);
          user.last_state = "main_mijoz";
          await user.save();
          await mainMijoz(ctx);
        } else if (user.last_state === "change_mijoz_phone") {
          user.phone_number = String(ctx.message.contact.phone_number);
          user.last_state = "change_mijoz";
          await user.save();
          ctx.reply(
            "Telefon raqam muvaffaqiyatli o'zgardi ✅, O'zgartirmoqchi bo'lgan ma'lumotingizni tanlang",
            {
              parse_mode: "HTML",
              ...Markup.keyboard([
                ["Ism, Familiya ✏️"],
                ["Telefon raqam 📞"],
                ["orqaga ↩️"],
              ]).resize(),
            }
          );
        }
      }
      if (master) {
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
        if (user.last_state === "searchLocationService") {
          const lon = ctx.message.location.longitude;
          const lat = ctx.message.location.latitude;
          user.location = `${lat},${lon}`;
          const results = await this.masterRepository.findAll({
            where: {
              service_id: +user.service_id,
            },
          });
          const distances = [];
          for (const result of results) {
            let to_lat = result.location?.split(",")[0];
            let to_lon = result.location?.split(",")[1];
            if (to_lat && to_lon) {
              const distance = await getDistance(lat, lon, to_lat, to_lon);
              distances.push({
                id: result.master_id,
                distance: distance,
                name: result.name,
              });
            }
          }

          distances.sort((a, b) => a.distance - b.distance);
          user.distance = JSON.stringify(distances);
          user.message_id = String(ctx.message.message_id + 2);
          user.changed("distance", true);
          user.paginationCount = 0;
          await user.save();
          await ctx.reply("Lokatsiya bo'yicha:", {
            parse_mode: "HTML",
            ...Markup.keyboard([["orqaga ↩️"]]).resize(),
          });

          await show_mijoz_locationsFirst(ctx, user);
        }
      }
      if (master) {
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

  //
  async onLocationMijoz(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }

      if (user.last_state === "select_service") {
        user.searchType = "location";

        user.last_state = "searchLocationService";
        await user.save();
        await search_mijoz_location(ctx);
      }
    } catch (error) {
      console.log(error);
    }
  }
  //
  async requestToAdmin(ctx: Context) {
    const user = await this.userRepository.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if (user) {
    }
    if (master) {
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
      await ctx.reply(
        `Mijozlar ro'yhati:\n ${clientsInfo ? clientsInfo : "Hozircha bo'sh"}`
      );
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
        // console.log(new Date(new Date().setHours(new Date().getHours() + 5)));
        let dateWithTimeStamps = new Date(
          new Date().setHours(new Date().getHours() + 5)
        );
        // console.log(dateWithTimeStamps.toISOString());
        let dateNow = dateWithTimeStamps.toISOString().split("T")[0];
        let timeNow = dateWithTimeStamps
          .toISOString()
          .split("T")[1]
          .slice(0, 5);
        // console.log(timeNow);
        // console.log(dateMatch);
        // console.log(dateNow);
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
        // console.log(parseInt(time), parseInt(timeNow), time, timeNow);
        while (parseInt(time) < parseInt(master.work_end_time)) {
          if (dateNow === dateMatch) {
            if (parseInt(time) > parseInt(timeNow)) {
              if (orderTimes.includes(time)) {
                for (let i = 0; i < orders.length; i++) {
                  if (orders[i].time === time) {
                    if (
                      orders[i].user_id === master.master_id &&
                      orders[i].master_id === master.master_id
                    ) {
                      inlineKeyboards.push(
                        Markup.button.callback(
                          `👨‍🔬 ${time}`,
                          `bookedwithme:date=${dateMatch}&time=${time}`
                        )
                      );
                    } else {
                      inlineKeyboards.push(
                        Markup.button.callback(
                          `❌ ${time}`,
                          `bookwithuser:id=${orders[i].user_id}&date=${dateMatch}&time=${time}`
                        )
                      );
                    }
                  }
                }
              } else {
                inlineKeyboards.push(
                  Markup.button.callback(
                    `${time}`,
                    `booking:date=${dateMatch}&time=${time}`
                  )
                );
              }
            }
          } else {
            if (orderTimes.includes(time)) {
              for (let i = 0; i < orders.length; i++) {
                if (orders[i].time === time) {
                  if (
                    orders[i].user_id === master.master_id &&
                    orders[i].master_id === master.master_id
                  ) {
                    inlineKeyboards.push(
                      Markup.button.callback(
                        `👨‍🔬 ${time}`,
                        `bookedwithme:date=${dateMatch}&time=${time}`
                      )
                    );
                  } else {
                    inlineKeyboards.push(
                      Markup.button.callback(
                        `❌ ${time}`,
                        `bookwithuser:id=${orders[i].user_id}&date=${dateMatch}&time=${time}`
                      )
                    );
                  }
                }
              }
            } else {
              inlineKeyboards.push(
                Markup.button.callback(
                  `${time}`,
                  `booking:date=${dateMatch}&time=${time}`
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
              minut
                ? minut.toString().length == 2
                  ? minut
                  : `0${minut}`
                : `00`
            }`;
          } else {
            time = `${hour < 10 ? `0${hour}` : hour}:${
              minut
                ? minut.toString().length == 2
                  ? minut
                  : `0${minut}`
                : `00`
            }`;
          }
          // console.log(time);
        }
        // console.log(inlineKeyboards);
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
        // console.log(...mainKeyboard);
        let fullDay = [
          Markup.button.callback("Bo'sh", `fulldaynotbusy:date=${dateMatch}`),
          Markup.button.callback("❌ Band", `fulldaybusy:date=${dateMatch}`),
          Markup.button.callback("Ortga", `toback:dates`),
        ];
        mainKeyboard.push(fullDay);
        const mes = await ctx.reply(
          `Siz tanlagan kunning umumiy vaqtlari ro'yhati\n${timeNow} holatiga ko'ra`,
          {
            parse_mode: "HTML",
            ...Markup.inlineKeyboard([...mainKeyboard]),
          }
        );
        master.update({ message_id: String(mes.message_id) });
      }
    }
  }

  async bookingWithMaster(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if ("match" in ctx) {
      if (master) {
        const message = ctx.match["input"];
        // console.log(message);
        const datas = message.slice(8);
        // console.log(datas);
        const date = datas.split("&")[0].split("=")[1];
        const time = datas.split("&")[1].split("=")[1];
        console.log(date, time);
        await this.orderRepository.create({
          user_id: master.master_id,
          master_id: master.master_id,
          service_id: master.service_id,
          date: date,
          time: time,
        });
        await this.helper(ctx, date, master);
      }
    }
  }

  async bookedWithUser(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if ("match" in ctx) {
      if (master) {
        const message = ctx.match["input"];
        const datas = message.slice(13);
        console.log(datas);
        const date = datas.split("&")[1].split("=")[1];
        const time = datas.split("&")[2].split("=")[1];
        const user_id = datas.split("&")[0].split("=")[1];
        const user = await this.userRepository.findOne({
          where: { user_id: user_id },
        });
        if (user) {
          const order = await this.orderRepository.findOne({
            where: { user_id: user_id, date: date, time: time },
          });
          console.log(order);
          if (order) {
            await ctx.telegram.sendMessage(
              user.user_id,
              `Assalomu alaykum hurmatli mijoz.\nSizning ${order.date} sanasida, soat ${order.time} da olgan ro'yhatingiz ma'lum sabablarga ko'ra\nUsta ${master.name} tomonidan bekor qilindi.\nNoqulaylir uchun uzr so'raymiz.`
            );
            await order.destroy();
            await this.orderRepository.create({
              user_id: master.master_id,
              master_id: master.master_id,
              date: date,
              time: time,
              service_id: master.service_id,
            });
            await this.helper(ctx, date, master);
          }
        }
      }
    }
  }

  async bookedWithMeUpdate(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if ("match" in ctx) {
      if (master) {
        const message = ctx.match["input"];
        // console.log(message);
        const datas = message.slice(8);
        // console.log(datas);
        const date = datas.split("&")[0].split("=")[1];
        const time = datas.split("&")[1].split("=")[1];
        console.log(date, time);
        const orderMaster = await this.orderRepository.findOne({
          where: {
            user_id: master.master_id,
            master_id: master.master_id,
            date: date,
            time: time,
            service_id: master.service_id,
          },
        });
        console.log(orderMaster);
        if (orderMaster) {
          await orderMaster.destroy();
          await this.helper(ctx, date, master);
        }
      }
    }
  }

  async fullDayNotBusy(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if ("match" in ctx) {
      if (master) {
        const message = ctx.match["input"];
        // console.log(message);
        const datas = message.slice(15);
        // console.log(datas);
        const date = datas.split("&")[0].split("=")[1];
        console.log(date);
        const ordersInThisDay = await this.orderRepository.findAll({
          where: { date: date },
        });
        console.log(ordersInThisDay, "buuuu");
        if (ordersInThisDay.length) {
          ordersInThisDay.forEach(async (order) => {
            if (order.user_id === process.env.ADMIN_ID) {
              console.log("shu yerda");
            } else {
              const user = await this.userRepository.findOne({
                where: { user_id: order.user_id },
              });
              if (user) {
                await ctx.telegram.sendMessage(
                  user.user_id,
                  `Assalomu alaykum hurmatli ${user.real_name}.\nSizning ${order.date} sanasida, soat ${order.time} da olgan ro'yhatingiz ma'lum sabablarga ko'ra\nUsta ${master.name} tomonidan bekor qilindi.\nNoqulaylir uchun uzr so'raymiz.`
                );
              }
            }
            await order.destroy();
          });
          await this.helper(ctx, date, master);
        }
      }
    }
  }

  async busyFullDayMaster(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if ("match" in ctx) {
      if (master) {
        const message = ctx.match["input"];
        // console.log(message);
        const datas = message.slice(12);
        // console.log(datas);
        const date = datas.split("&")[0].split("=")[1];
        console.log(date);
        const ordersInThisDay = await this.orderRepository.findAll({
          where: { date: date },
        });
        let uzunlik = ordersInThisDay.length;
        if (ordersInThisDay.length) {
          ordersInThisDay.forEach(async (order) => {
            if (order.user_id === process.env.ADMIN_ID) {
              await order.destroy();
            } else {
              const user = await this.userRepository.findOne({
                where: { user_id: order.user_id },
              });
              if (user) {
                await ctx.telegram.sendMessage(
                  user.user_id,
                  `Assalomu alaykum hurmatli ${user.real_name}.\nSizning ${order.date} sanasida, soat ${order.time} da olgan ro'yhatingiz ma'lum sabablarga ko'ra\nUsta ${master.name} tomonidan bekor qilindi.\nNoqulaylir uchun uzr so'raymiz.`
                );
              }
              await order.destroy();
            }
          });
        }
        // ===========================
        let dateWithTimeStamps = new Date(
          new Date().setHours(new Date().getHours() + 5)
        );

        let dateNow = dateWithTimeStamps.toISOString().split("T")[0];
        let timeNow = dateWithTimeStamps
          .toISOString()
          .split("T")[1]
          .slice(0, 5);

        let time = master.work_start_time;
        let count = 0;
        while (parseInt(time) < parseInt(master.work_end_time)) {
          count++;
          console.log(uzunlik, count);
          await this.orderRepository.create({
            user_id: master.master_id,
            master_id: master.master_id,
            date: date,
            time: time,
            service_id: master.service_id,
          });
          if (dateNow === date) {
            if (parseInt(time) > parseInt(timeNow)) {
              //
            }
          } else {
            //
          }
          let minut = +time.split(":")[1];
          let hour = +time.split(":")[0];
          minut = minut + +master.time_per_work;
          // console.log(minut);
          if (minut >= 60) {
            minut = minut - 60;
            time = `${+hour + 1 < 10 ? `0${hour + 1}` : hour + 1}:${
              minut
                ? minut.toString().length == 2
                  ? minut
                  : `0${minut}`
                : `00`
            }`;
          } else {
            time = `${hour < 10 ? `0${hour}` : hour}:${
              minut
                ? minut.toString().length == 2
                  ? minut
                  : `0${minut}`
                : `00`
            }`;
          }
          console.log(time, date);
        }
        if (count != uzunlik) {
          await this.helper(ctx, date, master);
        }
      }
    }
  }

  async toBack(ctx: Context) {
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

      await ctx.telegram.editMessageText(
        master.master_id,
        +master.message_id,
        null,
        "Kunni tanlang",
        {
          parse_mode: "HTML",
          ...Markup.inlineKeyboard([...inlineButtons]),
        }
      );
    }
  }

  async updateMasterInfos(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if (master) {
      await ctx.reply("✍️ O'zgartirish uchun kerakli bo'limni tanlang", {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [Markup.button.callback("✍️ Ism", "change_name")],
          [Markup.button.callback("📲 Raqam", "change_phone")],
          [Markup.button.callback("✍️ Ustaxona", "change_service_name")],
          [Markup.button.callback("✍️ Manzil", "change_address")],
          [Markup.button.callback("✍️ Mo'ljal", "change_target")],
          [Markup.button.callback("📍 Location", "change_location")],
          [
            Markup.button.callback(
              "🕔 Ish boshlash vaqti",
              "change_start_time"
            ),
          ],
          [Markup.button.callback("🕐 Ish yakunlash vaqti", "change_end_time")],
          [
            Markup.button.callback(
              "⏳ O'rtacha sarflanadigan vaqt",
              "change_time_per_work"
            ),
          ],
          [Markup.button.callback("Ortga", "tomainmenu")],
        ]),
      });
    }
  }

  async actionChange(ctx: Context, state: string) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if (master) {
      await master.update({ last_state: state });
      if (state == "change_name") {
        await ctx.reply("Yangi ism kiriting");
      } else if (state == "change_service_name") {
        await ctx.reply("yangi ustaxona nomini kiriting");
      } else if (state == "change_phone") {
        await ctx.reply("yangi raqam yuboring Namuna ( 998949174127 )");
      } else if (state == "change_address") {
        await ctx.reply("Yangi manzil yuboring");
      } else if (state == "change_target") {
        await ctx.reply("Yangi mo'ljal kiriting");
      } else if (state == "change_location") {
        await ctx.reply("Yangi location yuboring");
      } else if (state == "change_start_time") {
        await ctx.reply("Yangi boshlash vaqtini kiriting  Namune ( 09:00 )");
      } else if (state == "change_end_time") {
        await ctx.reply("Yangi yopilish vaqtini kiriting Namuna ( 18:00 )");
      } else if (state == "change_time_per_work") {
        await ctx.reply(
          "Bir kishi uchun sarflanadigan vaqtni kiriting Namuna ( 0 < ? < 60 )"
        );
      }
    }
  }

  async tomainmenu(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if (master) {
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
  }

  //
  async helper(ctx: Context, dateMatch: string, master: Master) {
    let dateWithTimeStamps = new Date(
      new Date().setHours(new Date().getHours() + 5)
    );
    // console.log(dateWithTimeStamps.toISOString());
    let dateNow = dateWithTimeStamps.toISOString().split("T")[0];
    let timeNow = dateWithTimeStamps.toISOString().split("T")[1].slice(0, 5);
    // console.log(timeNow);
    // console.log(dateMatch);
    // console.log(dateNow);
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
    // console.log(parseInt(time), parseInt(timeNow), time, timeNow);
    while (parseInt(time) < parseInt(master.work_end_time)) {
      if (dateNow === dateMatch) {
        if (parseInt(time) > parseInt(timeNow)) {
          if (orderTimes.includes(time)) {
            for (let i = 0; i < orders.length; i++) {
              if (orders[i].time === time) {
                if (
                  orders[i].user_id === master.master_id &&
                  orders[i].master_id === master.master_id
                ) {
                  inlineKeyboards.push(
                    Markup.button.callback(
                      `👨‍🔬 ${time}`,
                      `bookedwithme:date=${dateMatch}&time=${time}`
                    )
                  );
                } else {
                  inlineKeyboards.push(
                    Markup.button.callback(
                      `❌ ${time}`,
                      `bookwithuser:id=${orders[i].user_id}&date=${dateMatch}&time=${time}`
                    )
                  );
                }
              }
            }
          } else {
            inlineKeyboards.push(
              Markup.button.callback(
                `${time}`,
                `booking:date=${dateMatch}&time=${time}`
              )
            );
          }
        }
      } else {
        if (orderTimes.includes(time)) {
          for (let i = 0; i < orders.length; i++) {
            if (orders[i].time === time) {
              if (
                orders[i].user_id === master.master_id &&
                orders[i].master_id === master.master_id
              ) {
                inlineKeyboards.push(
                  Markup.button.callback(
                    `👨‍🔬 ${time}`,
                    `bookedwithme:date=${dateMatch}&time=${time}`
                  )
                );
              } else {
                inlineKeyboards.push(
                  Markup.button.callback(
                    `❌ ${time}`,
                    `bookwithuser:id=${orders[i].user_id}&date=${dateMatch}&time=${time}`
                  )
                );
              }
            }
          }
        } else {
          inlineKeyboards.push(
            Markup.button.callback(
              `${time}`,
              `booking:date=${dateMatch}&time=${time}`
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
          minut ? (minut.toString().length == 2 ? minut : `0${minut}`) : `00`
        }`;
      } else {
        time = `${hour < 10 ? `0${hour}` : hour}:${
          minut ? (minut.toString().length == 2 ? minut : `0${minut}`) : `00`
        }`;
      }
      // console.log(time);
    }
    // console.log(inlineKeyboards);
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
    // console.log(...mainKeyboard);
    let fullDay = [
      Markup.button.callback("Bo'sh", `fulldaynotbusy:date=${dateMatch}`),
      Markup.button.callback("❌ Band", `fulldaybusy:date=${dateMatch}`),
      Markup.button.callback("Ortga", `toback:dates`),
    ];
    mainKeyboard.push(fullDay);
    if (orderTimes.length) {
      await ctx.telegram.editMessageText(
        master.master_id,
        +master.message_id,
        null,
        `Siz tanlagan kunning umumiy vaqtlari ro'yhati\n${timeNow}:${new Date().getSeconds()} holatiga ko'ra`,
        {
          parse_mode: "HTML",
          ...Markup.inlineKeyboard([...mainKeyboard]),
        }
      );
    }
  }

  // ==========

  async complectMasters(ctx: Context) {
    const services = await this.serviceRepository.findAll();
    let serviceNames = [];
    for (let i = 0; i < services.length; i++) {
      serviceNames.push([
        Markup.button.callback(services[i].name, `fields=${services[i].id}`),
      ]);
    }
    serviceNames.push([Markup.button.callback("🏠 Bosh menyu", "mainmenu")]);
    serviceNames.push([
      Markup.button.callback(
        "✍️ Hamma userlarga xabar yuborish",
        "sSmsAllUser"
      ),
    ]);
    await ctx.reply("Ustalarning yo'nalishlaridan birini tanlang", {
      ...Markup.inlineKeyboard([...serviceNames]),
    });
  }

  // ==============

  async onMijoz(ctx: Context) {
    try {
      const mijoz_id = String(ctx.from.id);
      let user = await this.userRepository.findOne({
        where: { user_id: mijoz_id },
      });

      if (!user) {
        user = await this.userRepository.create({
          user_id: mijoz_id,
          last_name: ctx.from.last_name,
          first_name: ctx.from.first_name,
          status: true,
          last_state: "register_mijoz",
          username: ctx.from.username,
        });
        await mijoz_ism(ctx);
      } else if (!user?.real_name) {
        await mijoz_ism(ctx);
      } else if (!user?.phone_number) {
        user.last_state = "contact_mijoz";
        await user.save();
        await mijoz_phone(ctx);
      } else {
        user.last_state = "main_mijoz";
        await user.save();
        await mainMijoz(ctx);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onPaginationName(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }

      user.paginationCount = +ctx.match["input"].split("-")[1];
      await user.save();
      await searchMasterName(ctx, user, this.masterRepository);
    } catch (error) {
      console.log(error);
    }
  }
  async onPaginationRating(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }
      user.paginationCount = +ctx.match["input"].split("-")[1];
      await user.save();
      await searchMasterRating(ctx, user, this.masterRepository);
    } catch (error) {
      console.log(error);
    }
  }
  async onPaginationLocation(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }
      user.paginationCount = +ctx.match["input"].split("-")[1];
      await user.save();
      await show_mijoz_location(ctx, user);
    } catch (error) {
      console.log(error);
    }
  }
  async onPaginationTime(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }

      user.paginationCount = +ctx.match["input"].split("-")[1];
      await user.save();
      await tima_pagination(ctx, user);
    } catch (error) {
      console.log(error);
    }
  }

  async changeMijozData(ctx: Context) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }
      if (user.last_state == "main_mijoz") {
        user.last_state = "change_mijoz";
        await user.save();
        await change_mijoz_data(ctx);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async changeName(ctx: Context) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }
      if (user.last_state == "change_mijoz") {
        user.last_state = "change_mijoz_name";
        await user.save();

        await change_mijoz_ism(ctx);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async changeNumber(ctx: Context) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }
      if (user.last_state == "change_mijoz") {
        user.last_state = "change_mijoz_phone";
        await user.save();
        await change_mijoz_phone(ctx);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async orqaga(ctx: Context) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }

      if (user.last_state == "change_mijoz") {
        user.last_state = "main_mijoz";
        await user.save();
        await mainMijoz(ctx);
      } else if (
        user.last_state == "change_mijoz_name" ||
        user.last_state == "change_mijoz_phone"
      ) {
        user.last_state = "change_mijoz";
        await user.save();
        await change_mijoz_data(ctx);
      } else if (user.last_state == "select_service") {
        user.last_state = "main_mijoz";
        await user.save();
        await mainMijoz(ctx);
      } else if (
        user.last_state == "searchNameService" ||
        user.last_state == "searchRatingService" ||
        user.last_state == "searchLocationService"
      ) {
        user.last_state = "select_service";
        await user.save();
        await select_service_data(ctx);
      } else if (user.last_state == "select_master") {
        await ctx.telegram.deleteMessage(+user.user_id, +user.message_id);

        if (user.searchType == "name") {
          user.last_state = "searchNameService";
          const newCtx = await searchMasterNameFirst(
            ctx,
            user,
            this.masterRepository
          );
          user.message_id = String(newCtx.message_id);
          await user.save();
        } else if (user.searchType == "location") {
          user.last_state = "searchLocationService";
          const newCtx = await show_mijoz_locationsFirst(ctx, user);
          user.message_id = String(newCtx.message_id);
          await user.save();
        } else if (user.searchType == "rating") {
          user.last_state = "searchRatingService";
          const newCtx = await searchMasterRatingFirst(
            ctx,
            user,
            this.masterRepository
          );
          user.message_id = String(newCtx.message_id);
          await user.save();
        }
      } else if (user.last_state == "ranking") {
        const master = await this.masterRepository.findOne({
          where: { master_id: user.selectMasterId },
        });
        if (!master) {
          user.last_state = "main_mijoz";
          await user.save();
          return await mainMijoz(ctx);
        }
        user.last_state = "select_master";
        await user.save();
        await select_master(ctx, master);
      } else if (user.last_state == "getSevenDays") {
        const master = await this.masterRepository.findOne({
          where: { master_id: user.selectMasterId },
        });
        if (!master) {
          user.last_state = "main_mijoz";
          await user.save();
          return await mainMijoz(ctx);
        }
        user.last_state = "select_master";
        await user.save();
        await select_master(ctx, master);
      } else if (user.last_state == "getTimes") {
        user.last_state = "getSevenDays";
        user.paginationCount = 0;
        await user.save();
        await getSevenDeys(ctx);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onServices(ctx: Context) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }
      if (user.last_state == "main_mijoz") {
        const services = await this.serviceRepository.findAll();
        if (services.length) {
          const service = [];
          services.forEach((item) => {
            service.push([
              { text: item.name, callback_data: `service-${item.id}` },
            ]);
          });
          await services_mijoz(ctx, service);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async selectServices(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }

      user.last_state = "select_service";
      user.service_id = +ctx.match["input"].split("-")[1];
      user.save();

      await ctx.reply(`Quyidagi kriteriyalar bo'yicha tanlang: `, {
        parse_mode: "HTML",
        ...Markup.keyboard([
          ["ISMI 📝"],
          ["REYTING ⭐️"],
          ["Lokatsiya 📍"],
          ["orqaga ↩️"],
        ]).resize(),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async serachNameMijoz(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }

      if (user.last_state === "select_service") {
        user.searchType = "name";
        user.last_state = "searchNameService";
        await user.save();
        await search_mijoz_ism(ctx);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async serachRatingMijoz(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }

      if (user.last_state === "select_service") {
        user.searchType = "rating";
        user.last_state = "searchRatingService";
        await ctx.reply("Reyting bo'yicha:", {
          parse_mode: "HTML",
          ...Markup.keyboard([["orqaga ↩️"]]).resize(),
        });

        user.paginationCount = 0;
        user.message_id = String(ctx.message.message_id + 2);
        await user.save();
        await searchMasterRatingFirst(ctx, user, this.masterRepository);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async selectMaster(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }

      if (
        user.last_state == "searchNameService" ||
        user.last_state == "searchRatingService" ||
        user.last_state == "searchLocationService"
      ) {
        const master = await this.masterRepository.findOne({
          where: { master_id: ctx.match["input"].split("-")[1] },
        });
        if (!master) {
          user.last_state = "main_mijoz";
          await user.save();
          return await mainMijoz(ctx);
        }

        user.last_state = "select_master";
        user.selectMasterId = ctx.match["input"].split("-")[1];
        await ctx.telegram.deleteMessage(+user.user_id, +user.message_id);
        const newCtx = await select_master(ctx, master);
        user.message_id = String(newCtx.message_id);
        await user.save();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async showLocation(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }
      if (user.last_state == "select_master") {
        const lat = ctx.match["input"].split("-")[1].split(",")[0];
        const lon = ctx.match["input"].split("-")[1].split(",")[1];
        await ctx.replyWithLocation(+lat, +lon, +user.user_id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async toRankings(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }
      if (user.last_state == "select_master") {
        const ranking = await this.rankingRepository.findOne({
          where: { user_id: user.user_id, master_id: user.selectMasterId },
        });
        user.last_state = "ranking";
        await user.save();
        await ranking_master(ctx, ranking?.rank);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getRank(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }
      if (user.last_state == "ranking") {
        const rank = +ctx.match["input"].split("-")[1];
        let ranking = await this.rankingRepository.findOne({
          where: { user_id: user.user_id, master_id: user.selectMasterId },
        });
        if (!ranking) {
          ranking = await this.rankingRepository.create({
            user_id: user.user_id,
            master_id: user.selectMasterId,
            rank,
          });
        } else {
          await this.rankingRepository.update(
            { rank },
            {
              where: {
                user_id: user.user_id,
                master_id: user.selectMasterId,
              },
            }
          );
        }
        const ranks = await this.rankingRepository.findAll({
          where: { master_id: user.selectMasterId },
        });
        const total_renk = ranks.reduce((a, b) => a + b.rank, 0) / ranks.length;
        const master = await this.masterRepository.findOne({
          where: { master_id: user.selectMasterId },
        });
        if (!master) {
          user.last_state = "main_mijoz";
          await user.save();
          return await mainMijoz(ctx);
        }
        master.rating = total_renk;
        await master.save();

        user.last_state = "select_master";
        await user.save();
        await select_master(ctx, master);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getDays(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }
      if (user.last_state == "select_master") {
        user.last_state = "getSevenDays";
        await user.save();
        await getSevenDeys(ctx);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getTimes(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }
      if (user.last_state == "getSevenDays") {
        const master = await this.masterRepository.findOne({
          where: { master_id: user.selectMasterId },
        });
        if (!master) {
          user.last_state = "main_mijoz";
          user.paginationCount = 0;
          await user.save();
          return await mainMijoz(ctx);
        }
        await get_times(ctx, user, this.orderRepository, master);
        const ctxNew = await tima_paginationsFirst(ctx, user);
        user.paginationCount = 0;
        await user.save();
        user.select_day = ctx.match["input"].split("-")[1];
        user.last_state = "getTimes";
        user.message_id = ctxNew.message_id;
        await user.save();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async tanlanganHizmatlar(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }
      let orders = await this.orderRepository.findAll({
        where: { user_id: user.user_id },
      });

      if (orders.length) {
        orders.forEach(async (order) => {
          const master = await this.masterRepository.findOne({
            where: { master_id: order.master_id },
          });

          await tanlangan_hizmatlar(ctx, order, master);
        });
      } else {
        ctx.reply("Hali hech qaysi hizmatga ro'yhatdan o'tmagansiz");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async sendSmsMaster(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }
      if (user.last_state == "getTimes") {
        const master = await this.masterRepository.findOne({
          where: { master_id: user.selectMasterId },
        });
        if (!master) {
          user.last_state = "main_mijoz";
          user.paginationCount = 0;
          await user.save();
          return await mainMijoz(ctx);
        }
        const order = await this.orderRepository.create({
          user_id: user.user_id,
          master_id: user.selectMasterId,
          date: user.select_day,
          time: ctx.match["input"].split("-")[1],
          service_id: master.service_id,
        });

        await sendSMSMaster(ctx, user, order);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async confirmMessage(ctx) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }
      const order = await this.orderRepository.findOne({
        where: { id: +ctx.match["input"].split("-")[1] },
      });
      if (order) {
        if (ctx.match["input"].split("-")[0] == "xa") {
          ctx.telegram.sendMessage(
            +order.user_id,
            `${order.date}.${order.time}-vaqtiga yuborgan so'rovingiz qabul qilindi ✅`
          );
          ctx.telegram.sendMessage(
            +order.master_id,
            `${order.date}.${order.time}-vaqtiga mijozni qabul qildingiz qabul qilindi ✅`
          );
        } else {
          ctx.telegram.sendMessage(
            +order.user_id,
            `${order.date}.${order.time}-vaqtiga yuborgan so'rovingiz qabul qilinmadi ❌`
          );
          ctx.telegram.sendMessage(
            +order.master_id,
            `${order.date}.${order.time}-vaqtiga mijozni qabul qilmadingiz ❌`
          );
          await this.orderRepository.destroy({ where: { id: order.id } });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
