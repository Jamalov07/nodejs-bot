"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const app_constants_1 = require("./app.constants");
const user_model_1 = require("./models/user.model");
const sequelize_2 = require("sequelize");
const service_type_model_1 = require("./models/service_type.model");
const master_model_1 = require("./models/master.model");
const order_model_1 = require("./models/order.model");
const admin_model_1 = require("./models/admin.model");
const getServices_1 = require("./helpers/getServices");
const returnMenuForUser_1 = require("./helpers/returnMenuForUser");
const boshMenu_1 = require("./helpers/boshMenu");
const mijoz_ism_1 = require("./helpers/mijoz_ism");
const mijoz_phone_1 = require("./helpers/mijoz_phone");
const main_mijoz_1 = require("./helpers/main_mijoz");
const changeMijozData_1 = require("./helpers/changeMijozData");
const searchMasterName_1 = require("./helpers/searchMasterName");
const searchRatingMaster_1 = require("./helpers/searchRatingMaster");
const searchMasterLocation_1 = require("./helpers/searchMasterLocation");
const distance_1 = require("./helpers/distance");
const selectMaster_1 = require("./helpers/selectMaster");
const ranking_model_1 = require("./models/ranking.model");
const toRanking_1 = require("./helpers/toRanking");
const getSevenDays_1 = require("./helpers/getSevenDays");
const getTime_1 = require("./helpers/getTime");
const timePagination_1 = require("./helpers/timePagination");
const tanlanganHizmatlar_1 = require("./helpers/tanlanganHizmatlar");
const sendMasterSms_1 = require("./helpers/sendMasterSms");
const services_1 = require("./helpers/services");
let AppService = class AppService {
    constructor(userRepository, serviceRepository, masterRepository, orderRepository, adminRepository, rankingRepository, bot) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.masterRepository = masterRepository;
        this.orderRepository = orderRepository;
        this.adminRepository = adminRepository;
        this.rankingRepository = rankingRepository;
        this.bot = bot;
    }
    async onStart(ctx) {
        return await (0, boshMenu_1.boshMenu)(ctx);
    }
    async registration(ctx) {
        const user = await this.userRepository.findOne({
            where: { user_id: `${ctx.from.id}` },
        });
        if (user) {
        }
        else {
            await ctx.reply("Kim bo'lib ro'yhatdan o'tasiz?", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([["👨‍🚀 Usta", "🤵‍♂️ Mijoz"]])
                .oneTime()
                .resize()));
        }
    }
    async hearsMaster(ctx) {
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if (master) {
        }
        else {
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
                    telegraf_1.Markup.button.callback(services[i].name, `thisservice=${services[i].id}`),
                ]);
            }
            await ctx.reply("O'zingizning sohangizni tanlang", Object.assign({}, telegraf_1.Markup.inlineKeyboard([
                ...serviceNames,
                [telegraf_1.Markup.button.callback("❌ Bekor qilish", "delmyinfo")],
            ])));
        }
    }
    async hearsServiceTypes(ctx) {
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
                    await ctx.reply("Ismingizni kiriting", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([["❌ Bekor qilish"]])
                        .oneTime()
                        .resize()));
                }
            }
            else {
                await ctx.reply("/start");
            }
        }
    }
    async onMessage(ctx) {
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
                    (0, mijoz_phone_1.mijoz_phone)(ctx);
                }
                else if (user.last_state === "change_mijoz_name") {
                    user.real_name = ctx.message.text;
                    user.last_state = "change_mijoz";
                    await user.save();
                    ctx.reply("Ism muvaffaqiyatli o'zgardi ✅, O'zgartirmoqchi bo'lgan ma'lumotingizni tanlang", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([
                        ["Ism, Familiya ✏️"],
                        ["Telefon raqam 📞"],
                        ["orqaga ↩️"],
                    ]).resize()));
                }
                else if (user.last_state === "searchNameService") {
                    const searchName = ctx.message.text;
                    user.paginationCount = 0;
                    user.searchName = searchName;
                    await user.save();
                    await (0, searchMasterName_1.searchMasterNameFirst)(ctx, user, this.masterRepository);
                }
            }
            else if (master) {
                if (master.last_state === "name") {
                    await master.update({
                        name: ctx.message.text,
                        last_state: "phone_number",
                    });
                    await ctx.reply("Siz bilan bog'lanish uchun 📲 Raqam yuborish tugmasini bosing", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([
                        [telegraf_1.Markup.button.contactRequest("📲 Raqam yuborish")],
                        ["❌ Bekor qilish"],
                    ])
                        .oneTime()
                        .resize()));
                }
                else if (master.last_state === "work_start_time") {
                    let time = ctx.message.text.split(":");
                    if (+time.join("") <= 2400 &&
                        ctx.message.text.length == 5 &&
                        +time[0] <= 24 &&
                        +time[1] <= 59) {
                        await master.update({
                            work_start_time: ctx.message.text,
                            last_state: "work_end_time",
                        });
                        await ctx.reply("Ish tugatish vaqtingizni kiriting. Namuna ( 21:00 )");
                    }
                    else {
                        await ctx.reply("Vaqtni ko'rsatilgan namunadek kiriting");
                    }
                }
                else if (master.last_state === "work_end_time") {
                    let time = ctx.message.text.split(":");
                    if (+time.join("") <= 2400 &&
                        ctx.message.text.length == 5 &&
                        +time[0] <= 24 &&
                        +time[1] <= 59) {
                        let date = ctx.message.text === "00:00" ? "24:00" : ctx.message.text;
                        await master.update({
                            work_end_time: date,
                            last_state: "time_per",
                        });
                        await ctx.reply("Bir mijoz uchun maksimal sarflaydigan vaqtingizni minutda kiriting. Maksimal 60 minut. Namuna ( 30 )");
                    }
                    else {
                        await ctx.reply("Vaqtni ko'rsatilgan namunadek kiriting");
                    }
                }
                else if (master.last_state === "time_per") {
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
                        await ctx.reply(masterInfo, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
                            [telegraf_1.Markup.button.callback("✅ Tasdiqlash", `reqtoadmin`)],
                            [telegraf_1.Markup.button.callback("❌ Bekor qilish", `delmyinfo`)],
                        ])));
                    }
                }
                else if (master.last_state === "send_message") {
                    await ctx.telegram.forwardMessage(process.env.ADMIN_ID, master.master_id, ctx.message.message_id);
                    let masterInfo = `Ismi: ${master.name}\nUsta ${master.createdAt
                        .toString()
                        .split(" ")
                        .slice(1, 5)
                        .join(" ")} da ro'yhatdan o'tgan\nHarakat: ${master.is_active ? "ruhsat berilgan" : "bloklangan"}\nHolati: ${master.status ? "tasdiqlangan" : "tasdiqlanmagan"}`;
                    await ctx.telegram.sendMessage(process.env.ADMIN_ID, masterInfo, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
                        [
                            telegraf_1.Markup.button.callback("🔓 Bloklash", `blockthis=${master.master_id}`),
                        ],
                        [
                            telegraf_1.Markup.button.callback("✅ Tasdiqlash", `allowto=${master.master_id}`),
                        ],
                    ])));
                    await master.update({ last_state: "finish" });
                }
                else if (master.last_state === "service_name") {
                    await master.update({
                        service_name: ctx.message.text,
                        last_state: "address",
                    });
                    await ctx.reply("Ustaxona to'liq manzilini kiriting (ixtiyoriy)", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([["⏭ keyingisi"], ["❌ Bekor qilish"]])
                        .oneTime()
                        .resize()));
                }
                else if (master.last_state === "address") {
                    await master.update({
                        address: ctx.message.text,
                        last_state: "target_address",
                    });
                    await ctx.reply("Mo'ljalni kiriting (ixtiyoriy)", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([["⏭ keyingisi"], ["❌ Bekor qilish"]])
                        .oneTime()
                        .resize()));
                }
                else if (master.last_state === "target_address") {
                    await master.update({
                        target_address: ctx.message.text,
                        last_state: "location",
                    });
                    await ctx.reply("Ustaxona lokatsiyasini yuboring", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([["❌ Bekor qilish"]])
                        .oneTime()
                        .resize()));
                }
                else if (master.last_state === "change_name") {
                    await master.update({ name: ctx.message.text, last_state: "finish" });
                    await ctx.reply(`Ismingiz ${ctx.message.text} ga o'zgartirildi`);
                }
                else if (master.last_state === "change_phone") {
                    if (!isNaN(+ctx.message.text) && ctx.message.text.length == 12) {
                        await master.update({
                            phone_number: ctx.message.text,
                            last_state: "finish",
                        });
                        await ctx.reply(`Raqamingiz ${ctx.message.text} ga o'zgartirildi`);
                    }
                }
                else if (master.last_state === "change_service_name") {
                    await master.update({
                        service_name: ctx.message.text,
                        last_state: "finish",
                    });
                    await ctx.reply(`Ustaxona nomi ${ctx.message.text} ga o'zgartirildi`);
                }
                else if (master.last_state === "change_address") {
                    await master.update({
                        address: ctx.message.text,
                        last_state: "finish",
                    });
                    await ctx.reply(`Manzil ${ctx.message.text} ga o'zgartirildi`);
                }
                else if (master.last_state === "change_target") {
                    await master.update({
                        target_address: ctx.message.text,
                        last_state: "finish",
                    });
                    await ctx.reply(`Mo'ljal ${ctx.message.text} ga o'zgartirildi`);
                }
                else if (master.last_state === "change_start_time") {
                    let time = ctx.message.text.split(":");
                    if (+time.join("") <= 2400 &&
                        ctx.message.text.length == 5 &&
                        +time[0] <= 24 &&
                        +time[1] <= 59) {
                        await master.update({
                            work_start_time: ctx.message.text,
                            last_state: "finish",
                        });
                        await ctx.reply(`Ochilish vaqti ${ctx.message.text} ga o'zgartirildi`);
                    }
                    else {
                        await ctx.reply("Vaqtni ko'rsatilgan namunadek kiriting");
                    }
                }
                else if (master.last_state === "change_end_time") {
                    let time = ctx.message.text.split(":");
                    if (+time.join("") <= 2400 &&
                        ctx.message.text.length == 5 &&
                        +time[0] <= 24 &&
                        +time[1] <= 59) {
                        let date = ctx.message.text === "00:00" ? "24:00" : ctx.message.text;
                        await master.update({
                            work_end_time: date,
                            last_state: "finish",
                        });
                        await ctx.reply(`Yopilish vaqti ${ctx.message.text} ga o'zgartirildi`);
                    }
                    else {
                        await ctx.reply("Vaqtni ko'rsatilgan namunadek kiriting");
                    }
                }
                else if (master.last_state === "change_time_per_work") {
                    if (!isNaN(+ctx.message.text) &&
                        +ctx.message.text < 60 &&
                        +ctx.message.text != 0) {
                        await master.update({
                            time_per_work: ctx.message.text,
                            last_state: "finish",
                        });
                        await ctx.reply(`Bir mijoz uchun sarflanadigan vaqt ${ctx.message.text} minut ga o'zgartirildi`);
                    }
                    else {
                        await ctx.reply("Ko'rsatilgan namunadek kiriting");
                    }
                }
            }
            else if (admin) {
                if (admin.last_state == "addnewService") {
                    if ("text" in ctx.message) {
                        const check = await this.serviceRepository.findOne({
                            where: {
                                name: `${ctx.message.text}`,
                            },
                        });
                        const services = await this.serviceRepository.findAll();
                        if (check) {
                            await (0, getServices_1.getterServices)(services, ctx);
                            await ctx.reply("<b>Bunday nomli xizmat mavjud !</b>", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([
                                [
                                    "♻️ Yana qo'shish",
                                    "🏠 Bosh menyu",
                                    "🧰 Xizmatlar bo'limiga qaytish",
                                ],
                            ])
                                .oneTime()
                                .resize()));
                        }
                        else {
                            await this.serviceRepository.create({
                                name: String(ctx.message.text),
                            });
                            const nServices = await this.serviceRepository.findAll();
                            admin.last_state = "finish";
                            await admin.save();
                            await (0, getServices_1.getterServices)(nServices, ctx);
                            await ctx.reply("<b>Muvaffaqiyatli qoshildi !</b>", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([
                                [
                                    "♻️ Yana qo'shish",
                                    "🏠 Bosh menyu",
                                    "🙍‍♂️ Mijozlar bo'limiga qaytish",
                                ],
                            ])
                                .oneTime()
                                .resize()));
                        }
                    }
                }
                else if (admin.last_state === "searchbynamemaster") {
                    if ("text" in ctx.message) {
                        const data = await this.masterRepository.findOne({
                            where: {
                                name: `${ctx.message.text}`,
                                service_id: admin.search_master_state,
                                status: true,
                            },
                        });
                        if (data) {
                            await this.adminRepository.update({
                                last_state: "finish",
                            }, {
                                where: {
                                    admin_id: `${ctx.from.id}`,
                                },
                            });
                            await ctx.reply(`Ismi: <b>${data.name}</b>\naddress:<b>${data.address}</b>\nrating:<b>${data.rating}</b>\ntelefon raqami:<b>${data.phone_number}</b>\nxizmat narxi:<b>${data.price}</b>`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
                                [
                                    telegraf_1.Markup.button.callback("❌ Ustani o'chirish", `delmaster=${data.master_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("✔️ Ustani aktiv emas qilib qo'yish", `deactivemas=${data.master_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("📊 Statistikani ko'rish", `showstats=${data.master_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("📝 Ustaga reklama yoki xabar yuborish", `sendmess=${data.master_id}`),
                                ],
                                [telegraf_1.Markup.button.callback("🏠 Bosh menyu", "mainmenu")],
                            ])));
                        }
                        else {
                            admin.search_master_state = 0;
                            admin.last_state = "finish";
                            await admin.save();
                            await ctx.replyWithHTML(`<b>Ushbu yo'nalishda bunday nomli usta yo'q</b>`);
                            await this.complectMasters(ctx);
                        }
                    }
                }
                else if (admin.last_state === "searchbynumbermaster") {
                    if ("text" in ctx.message) {
                        const data = await this.masterRepository.findOne({
                            where: {
                                phone_number: ctx.message.text,
                                service_id: admin.search_master_state,
                                status: true,
                            },
                        });
                        if (data) {
                            await ctx.reply(`Ismi: <b>${data.name}</b>\naddress:<b>${data.address}</b>\nrating:<b>${data.rating}</b>\ntelefon raqami:<b>${data.phone_number}</b>\nxizmat narxi:<b>${data.price}</b>`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
                                [
                                    telegraf_1.Markup.button.callback("❌ Ustani o'chirish", `delmaster=${data.master_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("✔️ Ustani aktiv emas qilib qo'yish", `deactivemas=${data.master_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("📊 Statistikani ko'rish", `showstats=${data.master_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("📝 Ustaga reklama yoki xabar yuborish", `sendmess=${data.master_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("✍️ Hammaga xabar yuborish", "sendAllSms"),
                                ],
                                [telegraf_1.Markup.button.callback("🏠 Bosh menyu", "mainmenu")],
                            ])));
                        }
                        else {
                            admin.search_master_state = 0;
                            admin.last_state = "finish";
                            await admin.save();
                            await ctx.reply(`<b>Ushbu yo'nalishda bunday raqamli usta yo'q</b>`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([
                                "🏠 Bosh menyu",
                                "👨‍⚕️ Usta yo'nalishlariga qaytish",
                                "📱 Yana telefon raqami orqali izlash",
                            ])
                                .oneTime()
                                .resize()));
                        }
                    }
                }
                else if (admin.last_state == "sendMessage") {
                    if ("text" in ctx.message) {
                        await ctx.telegram.sendMessage(admin.target_user_id, `<b>Xurmatli mutahassis! Sizga admin tomonidan xabar yuborildi</b>:\n${ctx.message.text}`, {
                            parse_mode: "HTML",
                        });
                        await ctx.reply("✍️ Ustaga xabaringiz yuborildi");
                        await this.complectMasters(ctx);
                    }
                }
                else if (admin.last_state == "updatefield") {
                    if ("text" in ctx.message) {
                        await this.serviceRepository.update({
                            name: String(ctx.message.text),
                        }, {
                            where: {
                                id: admin.target_service_type_id,
                            },
                        });
                        const service = await this.serviceRepository.findAll();
                        await (0, getServices_1.getterServices)(service, ctx);
                        admin.last_state = "finish";
                        await admin.save();
                        await ctx.reply("Muvvafiqatli ozgartirildi !\n Davom etish uchun quyidagi buttonlardan birini tanlang", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([
                            "🔄 Yana boshqa service typeni o'zgartirish",
                            "🏠 Bosh menyu",
                        ])
                            .oneTime()
                            .resize()));
                    }
                }
                else if (admin.last_state == "userbyname") {
                    if ("text" in ctx.message) {
                        const oldUser = await this.userRepository.findAll({
                            where: {
                                real_name: {
                                    [sequelize_2.Op.iLike]: `%${ctx.message.text}%`,
                                },
                            },
                            offset: 0,
                        });
                        const allUsers = await this.userRepository.findAll({
                            where: {
                                real_name: {
                                    [sequelize_2.Op.iLike]: `%${ctx.message.text}%`,
                                },
                            },
                            limit: 1,
                            offset: 0,
                        });
                        console.log(oldUser.length);
                        if (oldUser.length == 1) {
                            await ctx.reply(`Ismi:${allUsers[0].real_name}\nTelefon raqami:${allUsers[0].phone_number}`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
                                [
                                    telegraf_1.Markup.button.callback("❌ Mijozni ban qilish", `banuser=${allUsers[0].user_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("☑️ Mijozni ban dan yechish", `debanuser=${allUsers[0].user_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("✔️ Mijozni ban yoki ban emasligini tekshirish", `isban=${allUsers[0].user_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("📊 User haqida statistika chiqarish", `statuser=${allUsers[0].user_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("✍️ Mijozga sms yuborish", `msguser=${allUsers[0].user_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("🏠 User izlashga qaytish", "returntosearch"),
                                ],
                            ])));
                        }
                        else if (oldUser.length < 1) {
                            await (0, returnMenuForUser_1.returnMenuForUser)(ctx, "<b>Bunday nomli user yoq</b>");
                        }
                        else {
                            const listIndicator = [];
                            if (1 > 1) {
                                listIndicator.push(telegraf_1.Markup.button.callback("⏮ Oldingi", `prev=${0}`));
                            }
                            if (0 + 1 < oldUser.length) {
                                listIndicator.push(telegraf_1.Markup.button.callback("⏭ Keyingisi", `next=${ctx.message.text}=${0 + 1}`));
                            }
                            await ctx.replyWithHTML(`<b>Bunday ismli user ko'p</b>`);
                            await ctx.reply(`Ismi:${allUsers[0].real_name}\nTelefon raqami:${allUsers[0].phone_number}`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
                                [
                                    telegraf_1.Markup.button.callback("❌ Mijozni ban qilish", `banuser=${allUsers[0].user_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("☑️ Mijozni ban dan yechish", `debanuser=${allUsers[0].user_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("✔️ Mijozni ban yoki ban emasligini tekshirish", `isban=${allUsers[0].user_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("📊 User haqida statistika chiqarish", `statuser=${allUsers[0].user_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("✍️ Mijozga sms yuborish", `msguser=${allUsers[0].user_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("🏠 User izlashga qaytish", "returntosearch"),
                                ],
                                listIndicator,
                            ])));
                        }
                    }
                }
                else if (admin.last_state == "sendAllMasters") {
                    const masters = await this.masterRepository.findAll();
                    await this.adminRepository.update({
                        last_state: "finish",
                    }, {
                        where: {
                            admin_id: `${ctx.from.id}`,
                        },
                    });
                    if ("text" in ctx.message) {
                        for (let x of masters) {
                            await ctx.telegram.sendMessage(`${x.master_id}`, `<b>Xurmatli mutahassis! Admin tomonidan sizga xabar yuborildi</b>:\n ${ctx.message.text}`, {
                                parse_mode: "HTML",
                            });
                        }
                        await ctx.reply("Xabaringiz jonatildi", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
                            [telegraf_1.Markup.button.callback("🏠 Bosh menu", "mainmenu")],
                        ])));
                    }
                }
                else if (admin.last_state == "sendsmstouser") {
                    const users = await this.userRepository.findAll();
                    await this.adminRepository.update({
                        last_state: "finish",
                    }, {
                        where: {
                            admin_id: `${ctx.from.id}`,
                        },
                    });
                    if ("text" in ctx.message) {
                        for (let x of users) {
                            await ctx.telegram.sendMessage(`${x.user_id}`, `<b>Xurmatli foydalanuvchi! Admin tomonidan sizga xabar yuborildi</b>:\n ${ctx.message.text}`, {
                                parse_mode: "HTML",
                            });
                        }
                        await ctx.reply("Xabaringiz jonatildi", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
                            [telegraf_1.Markup.button.callback("🏠 Bosh menu", "mainmenu")],
                        ])));
                    }
                }
                else if (admin.last_state == "userbyphone") {
                    if ("text" in ctx.message) {
                        const oneUser = await this.userRepository.findOne({
                            where: {
                                phone_number: `${ctx.message.text}`,
                            },
                        });
                        if (oneUser) {
                            await ctx.reply(`<b>Ma'lumotlar</b>:\n<b>Userning ismi</b>:${oneUser.real_name}\n<b>Userning telefon raqami</b>:${oneUser.phone_number}\n`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
                                [
                                    telegraf_1.Markup.button.callback("❌ Mijozni ban qilish", `banuser=${oneUser.user_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("☑️ Mijozni ban dan yechish", `debanuser=${oneUser.user_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("✔️ Mijozni ban yoki ban emasligini tekshirish", `isban=${oneUser.user_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("📊 User haqida statistika chiqarish", `statuser=${oneUser.user_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("✍️ Mijozga sms yuborish", `msguser=${oneUser.user_id}`),
                                ],
                                [
                                    telegraf_1.Markup.button.callback("🏠 User izlashga qaytish", "returntosearch"),
                                ],
                            ])));
                        }
                        else {
                            await ctx.reply("Bunday raqamli user topilmadi", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([
                                "🏠 Bosh menyu",
                                "🙍‍♂️ Mijozlarni izlashda davom etish",
                            ])
                                .oneTime()
                                .resize()));
                        }
                    }
                }
                else if (admin.last_state == "sendmsguser") {
                    const admin = await this.adminRepository.findOne({
                        where: {
                            admin_id: `${ctx.from.id}`,
                        },
                    });
                    console.log(admin.target_user_id);
                    if ("text" in ctx.message) {
                        await ctx.telegram.sendMessage(admin.target_user_id, ctx.message.text);
                        await this.adminRepository.findOne({
                            where: {
                                last_state: "finish",
                            },
                        });
                        await (0, returnMenuForUser_1.returnMenuForUser)(ctx, "<b> Xabaringiz userga yuborildi! </b>");
                    }
                }
            }
        }
    }
    async onContact(ctx) {
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
                    await (0, main_mijoz_1.mainMijoz)(ctx);
                }
                else if (user.last_state === "change_mijoz_phone") {
                    user.phone_number = String(ctx.message.contact.phone_number);
                    user.last_state = "change_mijoz";
                    await user.save();
                    ctx.reply("Telefon raqam muvaffaqiyatli o'zgardi ✅, O'zgartirmoqchi bo'lgan ma'lumotingizni tanlang", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([
                        ["Ism, Familiya ✏️"],
                        ["Telefon raqam 📞"],
                        ["orqaga ↩️"],
                    ]).resize()));
                }
            }
            else if (master) {
                if (master.last_state === "phone_number") {
                    if (ctx.from.id == ctx.message.contact.user_id) {
                        await master.update({
                            phone_number: ctx.message.contact.phone_number,
                            last_state: "service_name",
                        });
                        await ctx.reply("Ustaxona nomi bo'lsa kiriting (ixtiyoriy)", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([["⏭ keyingisi"], ["❌ Bekor qilish"]])
                            .oneTime()
                            .resize()));
                    }
                }
            }
        }
    }
    async hearsNext(ctx) {
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if (master) {
            if (master.last_state === "service_name") {
                master.update({ last_state: "address" });
                await ctx.reply("Ustaxona to'liq manzilini kiriting (ixtiyoriy)", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([["⏭ keyingisi"], ["❌ Bekor qilish"]])
                    .oneTime()
                    .resize()));
            }
            else if (master.last_state === "address") {
                master.update({ last_state: "target_address" });
                await ctx.reply("Mo'ljalni kiriting (ixtiyoriy)", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([["⏭ keyingisi"], ["❌ Bekor qilish"]])
                    .oneTime()
                    .resize()));
            }
            else if (master.last_state === "target_address") {
                master.update({ last_state: "location" });
                await ctx.reply("Ustaxona lokatsiyasini yuboring");
            }
        }
    }
    async onLocation(ctx) {
        var _a, _b;
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
                        let to_lat = (_a = result.location) === null || _a === void 0 ? void 0 : _a.split(",")[0];
                        let to_lon = (_b = result.location) === null || _b === void 0 ? void 0 : _b.split(",")[1];
                        if (to_lat && to_lon) {
                            const distance = await (0, distance_1.getDistance)(lat, lon, to_lat, to_lon);
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
                    await ctx.reply("Lokatsiya bo'yicha:", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([["orqaga ↩️"]]).resize()));
                    await (0, searchMasterLocation_1.show_mijoz_locationsFirst)(ctx, user);
                }
            }
            else if (master) {
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
    async onLocationMijoz(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            if (user.last_state === "select_service") {
                user.searchType = "location";
                user.last_state = "searchLocationService";
                await user.save();
                await (0, searchMasterLocation_1.search_mijoz_location)(ctx);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async requestToAdmin(ctx) {
        const user = await this.userRepository.findOne({
            where: { user_id: `${ctx.from.id}` },
        });
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if (user) {
        }
        else if (master) {
            if (master.last_state === "finish") {
                const serviceName = master.service_name
                    ? `\n🏛 Ustaxona nomi: ${master.service_name}`
                    : "";
                const address = master.address ? `\n📍 Manzili: ${master.address}` : "";
                const target = master.target_address
                    ? `\nMo'ljal: ${master.target_address}`
                    : "";
                const masterInfo = `👤 Ismi: ${master.name}\n📲 Telefon raqami: ${master.phone_number}${serviceName}${address}${target}\n🕔 Ish vaqti: ${master.work_start_time} dan - ${master.work_end_time} gacha\nBir mijoz uchun tahminan ${master.time_per_work} minut sarflaydi`;
                await ctx.telegram.sendMessage(process.env.ADMIN_ID, masterInfo, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
                    [
                        telegraf_1.Markup.button.callback("✅ Tasdiqlash", `allowto=${master.master_id}`),
                    ],
                    [
                        telegraf_1.Markup.button.callback("❌ Bekor qilish", `noallow=${master.master_id}"`),
                    ],
                ])));
                await ctx.reply("Sizning so'rov adminga yuborildi. Holatingizni tekshirib turing", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([
                    ["ℹ️ Tekshirish", "❌ Bekor qilish"],
                    ["✍️ Admin bilan bog'lanish"],
                ])
                    .oneTime()
                    .resize()));
            }
        }
    }
    async cancelRegistration(ctx) {
        const user = await this.userRepository.findOne({
            where: { user_id: `${ctx.from.id}` },
        });
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if (user) {
        }
        else if (master) {
            await master.destroy();
            await ctx.reply("Ro'yhatdan o'tish bekor qilindi", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([["👤 Ro'yhatdan o'tish"]])
                .oneTime()
                .resize()));
        }
    }
    async confirmInAdmin(ctx) {
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
    async checkStatusMaster(ctx) {
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if (master) {
            if (master.status) {
                await ctx.reply("O'zingizga kerakli bo'lgan bo'limni tanlang", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([
                    ["👥 Mijozlar", "🕔 Vaqt", "📊 Reyting"],
                    ["🔄 Ma'lumotlarni o'zgartirish"],
                ])
                    .oneTime()
                    .resize()));
            }
            else {
                await ctx.reply("So'rovingiz tasdiqlanishi kutilmoqda", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([
                    ["ℹ️ Tekshirish", "❌ Bekor qilish"],
                    ["✍️ Admin bilan bog'lanish"],
                ])
                    .oneTime()
                    .resize()));
            }
        }
    }
    async noAllow(ctx) {
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
    async toBlock(ctx) {
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
    async sendMessageToAdmin(ctx) {
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if (master) {
            master.update({ last_state: "send_message" });
            await ctx.reply("Adminga yubormoqchi bo'lgan habaringizni yuboring");
        }
    }
    async hearsMijozlarInMaster(ctx) {
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if (master) {
            const clients = await this.orderRepository.findAll({
                where: {
                    master_id: master.master_id,
                    date: {
                        [sequelize_2.Op.gt]: new Date(),
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
                        .join(".")} - ${clients[i].time} / ${user.real_name} , ${user.phone_number}\n`;
                }
            }
            await ctx.reply(`Mijozlar ro'yhati:\n ${clientsInfo ? clientsInfo : "Hozircha bo'sh"}`);
        }
    }
    async hearsRating(ctx) {
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
    async hearsTime(ctx) {
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
            if (timeNow < master.work_end_time) {
                inlineButtons.push([
                    telegraf_1.Markup.button.callback(dateNow, `search=date:${date.getFullYear()}-${dateNow
                        .split(".")
                        .reverse()
                        .join("-")}`),
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
                    telegraf_1.Markup.button.callback(nextDate, `search=date:${date.getFullYear()}-${nextDate
                        .split(".")
                        .reverse()
                        .join("-")}`),
                ]);
            }
            await ctx.reply("Kunni tanlang", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([...inlineButtons])));
        }
    }
    async actionSearchForDay(ctx) {
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if ("match" in ctx) {
            if (master) {
                const message = ctx.match["input"];
                const dateMatch = message.split("=")[1].split(":")[1];
                let dateWithTimeStamps = new Date(new Date().setHours(new Date().getHours() + 5));
                let dateNow = dateWithTimeStamps.toISOString().split("T")[0];
                let timeNow = dateWithTimeStamps
                    .toISOString()
                    .split("T")[1]
                    .slice(0, 5);
                let orders;
                if (dateNow === dateMatch) {
                    orders = await this.orderRepository.findAll({
                        where: {
                            master_id: master.master_id,
                            date: dateMatch,
                            time: {
                                [sequelize_2.Op.gt]: timeNow,
                            },
                        },
                    });
                }
                else {
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
                let time = master.work_start_time;
                let inlineKeyboards = [];
                while (parseInt(time) < parseInt(master.work_end_time)) {
                    if (dateNow === dateMatch) {
                        if (parseInt(time) > parseInt(timeNow)) {
                            if (orderTimes.includes(time)) {
                                for (let i = 0; i < orders.length; i++) {
                                    if (orders[i].time === time) {
                                        if (orders[i].user_id === master.master_id &&
                                            orders[i].master_id === master.master_id) {
                                            inlineKeyboards.push(telegraf_1.Markup.button.callback(`👨‍🔬 ${time}`, `bookedwithme:date=${dateMatch}&time=${time}`));
                                        }
                                        else {
                                            inlineKeyboards.push(telegraf_1.Markup.button.callback(`❌ ${time}`, `bookwithuser:id=${orders[i].user_id}&date=${dateMatch}&time=${time}`));
                                        }
                                    }
                                }
                            }
                            else {
                                inlineKeyboards.push(telegraf_1.Markup.button.callback(`${time}`, `booking:date=${dateMatch}&time=${time}`));
                            }
                        }
                    }
                    else {
                        if (orderTimes.includes(time)) {
                            for (let i = 0; i < orders.length; i++) {
                                if (orders[i].time === time) {
                                    if (orders[i].user_id === master.master_id &&
                                        orders[i].master_id === master.master_id) {
                                        inlineKeyboards.push(telegraf_1.Markup.button.callback(`👨‍🔬 ${time}`, `bookedwithme:date=${dateMatch}&time=${time}`));
                                    }
                                    else {
                                        inlineKeyboards.push(telegraf_1.Markup.button.callback(`❌ ${time}`, `bookwithuser:id=${orders[i].user_id}&date=${dateMatch}&time=${time}`));
                                    }
                                }
                            }
                        }
                        else {
                            inlineKeyboards.push(telegraf_1.Markup.button.callback(`${time}`, `booking:date=${dateMatch}&time=${time}`));
                        }
                    }
                    let minut = +time.split(":")[1];
                    let hour = +time.split(":")[0];
                    minut = minut + +master.time_per_work;
                    if (minut >= 60) {
                        minut = minut - 60;
                        time = `${+hour + 1 < 10 ? `0${hour + 1}` : hour + 1}:${minut
                            ? minut.toString().length == 2
                                ? minut
                                : `0${minut}`
                            : `00`}`;
                    }
                    else {
                        time = `${hour < 10 ? `0${hour}` : hour}:${minut
                            ? minut.toString().length == 2
                                ? minut
                                : `0${minut}`
                            : `00`}`;
                    }
                }
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
                let fullDay = [
                    telegraf_1.Markup.button.callback("Bo'sh", `fulldaynotbusy:date=${dateMatch}`),
                    telegraf_1.Markup.button.callback("❌ Band", `fulldaybusy:date=${dateMatch}`),
                    telegraf_1.Markup.button.callback("Ortga", `toback:dates`),
                ];
                mainKeyboard.push(fullDay);
                const mes = await ctx.reply(`Siz tanlagan kunning umumiy vaqtlari ro'yhati\n${timeNow} holatiga ko'ra`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([...mainKeyboard])));
                master.update({ message_id: String(mes.message_id) });
            }
        }
    }
    async bookingWithMaster(ctx) {
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if ("match" in ctx) {
            if (master) {
                const message = ctx.match["input"];
                const datas = message.slice(8);
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
    async bookedWithUser(ctx) {
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
                        await ctx.telegram.sendMessage(user.user_id, `Assalomu alaykum hurmatli mijoz.\nSizning ${order.date} sanasida, soat ${order.time} da olgan ro'yhatingiz ma'lum sabablarga ko'ra\nUsta ${master.name} tomonidan bekor qilindi.\nNoqulaylir uchun uzr so'raymiz.`);
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
    async bookedWithMeUpdate(ctx) {
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if ("match" in ctx) {
            if (master) {
                const message = ctx.match["input"];
                const datas = message.slice(8);
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
    async fullDayNotBusy(ctx) {
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if ("match" in ctx) {
            if (master) {
                const message = ctx.match["input"];
                const datas = message.slice(15);
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
                        }
                        else {
                            const user = await this.userRepository.findOne({
                                where: { user_id: order.user_id },
                            });
                            if (user) {
                                await ctx.telegram.sendMessage(user.user_id, `Assalomu alaykum hurmatli ${user.real_name}.\nSizning ${order.date} sanasida, soat ${order.time} da olgan ro'yhatingiz ma'lum sabablarga ko'ra\nUsta ${master.name} tomonidan bekor qilindi.\nNoqulaylir uchun uzr so'raymiz.`);
                            }
                        }
                        await order.destroy();
                    });
                    await this.helper(ctx, date, master);
                }
            }
        }
    }
    async busyFullDayMaster(ctx) {
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if ("match" in ctx) {
            if (master) {
                const message = ctx.match["input"];
                const datas = message.slice(12);
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
                        }
                        else {
                            const user = await this.userRepository.findOne({
                                where: { user_id: order.user_id },
                            });
                            if (user) {
                                await ctx.telegram.sendMessage(user.user_id, `Assalomu alaykum hurmatli ${user.real_name}.\nSizning ${order.date} sanasida, soat ${order.time} da olgan ro'yhatingiz ma'lum sabablarga ko'ra\nUsta ${master.name} tomonidan bekor qilindi.\nNoqulaylir uchun uzr so'raymiz.`);
                            }
                            await order.destroy();
                        }
                    });
                }
                let dateWithTimeStamps = new Date(new Date().setHours(new Date().getHours() + 5));
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
                        }
                    }
                    else {
                    }
                    let minut = +time.split(":")[1];
                    let hour = +time.split(":")[0];
                    minut = minut + +master.time_per_work;
                    if (minut >= 60) {
                        minut = minut - 60;
                        time = `${+hour + 1 < 10 ? `0${hour + 1}` : hour + 1}:${minut
                            ? minut.toString().length == 2
                                ? minut
                                : `0${minut}`
                            : `00`}`;
                    }
                    else {
                        time = `${hour < 10 ? `0${hour}` : hour}:${minut
                            ? minut.toString().length == 2
                                ? minut
                                : `0${minut}`
                            : `00`}`;
                    }
                    console.log(time, date);
                }
                if (count != uzunlik) {
                    await this.helper(ctx, date, master);
                }
            }
        }
    }
    async toBack(ctx) {
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
            if (timeNow < master.work_end_time) {
                inlineButtons.push([
                    telegraf_1.Markup.button.callback(dateNow, `search=date:${date.getFullYear()}-${dateNow
                        .split(".")
                        .reverse()
                        .join("-")}`),
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
                    telegraf_1.Markup.button.callback(nextDate, `search=date:${date.getFullYear()}-${nextDate
                        .split(".")
                        .reverse()
                        .join("-")}`),
                ]);
            }
            await ctx.telegram.editMessageText(master.master_id, +master.message_id, null, "Kunni tanlang", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([...inlineButtons])));
        }
    }
    async updateMasterInfos(ctx) {
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if (master) {
            await ctx.reply("✍️ O'zgartirish uchun kerakli bo'limni tanlang", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
                [telegraf_1.Markup.button.callback("✍️ Ism", "change_name")],
                [telegraf_1.Markup.button.callback("📲 Raqam", "change_phone")],
                [telegraf_1.Markup.button.callback("✍️ Ustaxona", "change_service_name")],
                [telegraf_1.Markup.button.callback("✍️ Manzil", "change_address")],
                [telegraf_1.Markup.button.callback("✍️ Mo'ljal", "change_target")],
                [telegraf_1.Markup.button.callback("📍 Location", "change_location")],
                [
                    telegraf_1.Markup.button.callback("🕔 Ish boshlash vaqti", "change_start_time"),
                ],
                [telegraf_1.Markup.button.callback("🕐 Ish yakunlash vaqti", "change_end_time")],
                [
                    telegraf_1.Markup.button.callback("⏳ O'rtacha sarflanadigan vaqt", "change_time_per_work"),
                ],
                [telegraf_1.Markup.button.callback("Ortga", "tomainmenu")],
            ])));
        }
    }
    async actionChange(ctx, state) {
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if (master) {
            await master.update({ last_state: state });
            if (state == "change_name") {
                await ctx.reply("Yangi ism kiriting");
            }
            else if (state == "change_service_name") {
                await ctx.reply("yangi ustaxona nomini kiriting");
            }
            else if (state == "change_phone") {
                await ctx.reply("yangi raqam yuboring Namuna ( 998949174127 )");
            }
            else if (state == "change_address") {
                await ctx.reply("Yangi manzil yuboring");
            }
            else if (state == "change_target") {
                await ctx.reply("Yangi mo'ljal kiriting");
            }
            else if (state == "change_location") {
                await ctx.reply("Yangi location yuboring");
            }
            else if (state == "change_start_time") {
                await ctx.reply("Yangi boshlash vaqtini kiriting  Namune ( 09:00 )");
            }
            else if (state == "change_end_time") {
                await ctx.reply("Yangi yopilish vaqtini kiriting Namuna ( 18:00 )");
            }
            else if (state == "change_time_per_work") {
                await ctx.reply("Bir kishi uchun sarflanadigan vaqtni kiriting Namuna ( 0 < ? < 60 )");
            }
        }
    }
    async tomainmenu(ctx) {
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if (master) {
            await ctx.reply("O'zingizga kerakli bo'lgan bo'limni tanlang", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([
                ["👥 Mijozlar", "🕔 Vaqt", "📊 Reyting"],
                ["🔄 Ma'lumotlarni o'zgartirish"],
            ])
                .oneTime()
                .resize()));
        }
    }
    async helper(ctx, dateMatch, master) {
        let dateWithTimeStamps = new Date(new Date().setHours(new Date().getHours() + 5));
        let dateNow = dateWithTimeStamps.toISOString().split("T")[0];
        let timeNow = dateWithTimeStamps.toISOString().split("T")[1].slice(0, 5);
        let orders;
        if (dateNow === dateMatch) {
            orders = await this.orderRepository.findAll({
                where: {
                    master_id: master.master_id,
                    date: dateMatch,
                    time: {
                        [sequelize_2.Op.gt]: timeNow,
                    },
                },
            });
        }
        else {
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
        let time = master.work_start_time;
        let inlineKeyboards = [];
        while (parseInt(time) < parseInt(master.work_end_time)) {
            if (dateNow === dateMatch) {
                if (parseInt(time) > parseInt(timeNow)) {
                    if (orderTimes.includes(time)) {
                        for (let i = 0; i < orders.length; i++) {
                            if (orders[i].time === time) {
                                if (orders[i].user_id === master.master_id &&
                                    orders[i].master_id === master.master_id) {
                                    inlineKeyboards.push(telegraf_1.Markup.button.callback(`👨‍🔬 ${time}`, `bookedwithme:date=${dateMatch}&time=${time}`));
                                }
                                else {
                                    inlineKeyboards.push(telegraf_1.Markup.button.callback(`❌ ${time}`, `bookwithuser:id=${orders[i].user_id}&date=${dateMatch}&time=${time}`));
                                }
                            }
                        }
                    }
                    else {
                        inlineKeyboards.push(telegraf_1.Markup.button.callback(`${time}`, `booking:date=${dateMatch}&time=${time}`));
                    }
                }
            }
            else {
                if (orderTimes.includes(time)) {
                    for (let i = 0; i < orders.length; i++) {
                        if (orders[i].time === time) {
                            if (orders[i].user_id === master.master_id &&
                                orders[i].master_id === master.master_id) {
                                inlineKeyboards.push(telegraf_1.Markup.button.callback(`👨‍🔬 ${time}`, `bookedwithme:date=${dateMatch}&time=${time}`));
                            }
                            else {
                                inlineKeyboards.push(telegraf_1.Markup.button.callback(`❌ ${time}`, `bookwithuser:id=${orders[i].user_id}&date=${dateMatch}&time=${time}`));
                            }
                        }
                    }
                }
                else {
                    inlineKeyboards.push(telegraf_1.Markup.button.callback(`${time}`, `booking:date=${dateMatch}&time=${time}`));
                }
            }
            let minut = +time.split(":")[1];
            let hour = +time.split(":")[0];
            minut = minut + +master.time_per_work;
            if (minut >= 60) {
                minut = minut - 60;
                time = `${+hour + 1 < 10 ? `0${hour + 1}` : hour + 1}:${minut ? (minut.toString().length == 2 ? minut : `0${minut}`) : `00`}`;
            }
            else {
                time = `${hour < 10 ? `0${hour}` : hour}:${minut ? (minut.toString().length == 2 ? minut : `0${minut}`) : `00`}`;
            }
        }
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
        let fullDay = [
            telegraf_1.Markup.button.callback("Bo'sh", `fulldaynotbusy:date=${dateMatch}`),
            telegraf_1.Markup.button.callback("❌ Band", `fulldaybusy:date=${dateMatch}`),
            telegraf_1.Markup.button.callback("Ortga", `toback:dates`),
        ];
        mainKeyboard.push(fullDay);
        if (orderTimes.length) {
            await ctx.telegram.editMessageText(master.master_id, +master.message_id, null, `Siz tanlagan kunning umumiy vaqtlari ro'yhati\n${timeNow}:${new Date().getSeconds()} holatiga ko'ra`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([...mainKeyboard])));
        }
    }
    async complectMasters(ctx) {
        const services = await this.serviceRepository.findAll();
        let serviceNames = [];
        for (let i = 0; i < services.length; i++) {
            serviceNames.push([
                telegraf_1.Markup.button.callback(services[i].name, `fields=${services[i].id}`),
            ]);
        }
        serviceNames.push([telegraf_1.Markup.button.callback("🏠 Bosh menyu", "mainmenu")]);
        serviceNames.push([
            telegraf_1.Markup.button.callback("✍️ Hamma userlarga xabar yuborish", "sSmsAllUser"),
        ]);
        await ctx.reply("Ustalarning yo'nalishlaridan birini tanlang", Object.assign({}, telegraf_1.Markup.inlineKeyboard([...serviceNames])));
    }
    async onMijoz(ctx) {
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
                await (0, mijoz_ism_1.mijoz_ism)(ctx);
            }
            else if (!(user === null || user === void 0 ? void 0 : user.real_name)) {
                await (0, mijoz_ism_1.mijoz_ism)(ctx);
            }
            else if (!(user === null || user === void 0 ? void 0 : user.phone_number)) {
                user.last_state = "contact_mijoz";
                await user.save();
                await (0, mijoz_phone_1.mijoz_phone)(ctx);
            }
            else {
                user.last_state = "main_mijoz";
                await user.save();
                await (0, main_mijoz_1.mainMijoz)(ctx);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async onPaginationName(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            user.paginationCount = +ctx.match["input"].split("-")[1];
            await user.save();
            await (0, searchMasterName_1.searchMasterName)(ctx, user, this.masterRepository);
        }
        catch (error) {
            console.log(error);
        }
    }
    async onPaginationRating(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            user.paginationCount = +ctx.match["input"].split("-")[1];
            await user.save();
            await (0, searchRatingMaster_1.searchMasterRating)(ctx, user, this.masterRepository);
        }
        catch (error) {
            console.log(error);
        }
    }
    async onPaginationLocation(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            user.paginationCount = +ctx.match["input"].split("-")[1];
            await user.save();
            await (0, searchMasterLocation_1.show_mijoz_location)(ctx, user);
        }
        catch (error) {
            console.log(error);
        }
    }
    async onPaginationTime(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            user.paginationCount = +ctx.match["input"].split("-")[1];
            await user.save();
            await (0, timePagination_1.tima_pagination)(ctx, user);
        }
        catch (error) {
            console.log(error);
        }
    }
    async changeMijozData(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            if (user.last_state == "main_mijoz") {
                user.last_state = "change_mijoz";
                await user.save();
                await (0, changeMijozData_1.change_mijoz_data)(ctx);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async changeName(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            if (user.last_state == "change_mijoz") {
                user.last_state = "change_mijoz_name";
                await user.save();
                await (0, mijoz_ism_1.change_mijoz_ism)(ctx);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async changeNumber(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            if (user.last_state == "change_mijoz") {
                user.last_state = "change_mijoz_phone";
                await user.save();
                await (0, mijoz_phone_1.change_mijoz_phone)(ctx);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async orqaga(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            if (user.last_state == "change_mijoz") {
                user.last_state = "main_mijoz";
                await user.save();
                await (0, main_mijoz_1.mainMijoz)(ctx);
            }
            else if (user.last_state == "change_mijoz_name" ||
                user.last_state == "change_mijoz_phone") {
                user.last_state = "change_mijoz";
                await user.save();
                await (0, changeMijozData_1.change_mijoz_data)(ctx);
            }
            else if (user.last_state == "select_service") {
                user.last_state = "main_mijoz";
                await user.save();
                await (0, main_mijoz_1.mainMijoz)(ctx);
            }
            else if (user.last_state == "searchNameService" ||
                user.last_state == "searchRatingService" ||
                user.last_state == "searchLocationService") {
                user.last_state = "select_service";
                await user.save();
                await (0, changeMijozData_1.select_service_data)(ctx);
            }
            else if (user.last_state == "select_master") {
                await ctx.telegram.deleteMessage(+user.user_id, +user.message_id);
                if (user.searchType == "name") {
                    user.last_state = "searchNameService";
                    const newCtx = await (0, searchMasterName_1.searchMasterNameFirst)(ctx, user, this.masterRepository);
                    user.message_id = String(newCtx.message_id);
                    await user.save();
                }
                else if (user.searchType == "location") {
                    user.last_state = "searchLocationService";
                    const newCtx = await (0, searchMasterLocation_1.show_mijoz_locationsFirst)(ctx, user);
                    user.message_id = String(newCtx.message_id);
                    await user.save();
                }
                else if (user.searchType == "rating") {
                    user.last_state = "searchRatingService";
                    const newCtx = await (0, searchRatingMaster_1.searchMasterRatingFirst)(ctx, user, this.masterRepository);
                    user.message_id = String(newCtx.message_id);
                    await user.save();
                }
            }
            else if (user.last_state == "ranking") {
                const master = await this.masterRepository.findOne({
                    where: { master_id: user.selectMasterId },
                });
                if (!master) {
                    user.last_state = "main_mijoz";
                    await user.save();
                    return await (0, main_mijoz_1.mainMijoz)(ctx);
                }
                user.last_state = "select_master";
                await user.save();
                await (0, selectMaster_1.select_master)(ctx, master);
            }
            else if (user.last_state == "getSevenDays") {
                const master = await this.masterRepository.findOne({
                    where: { master_id: user.selectMasterId },
                });
                if (!master) {
                    user.last_state = "main_mijoz";
                    await user.save();
                    return await (0, main_mijoz_1.mainMijoz)(ctx);
                }
                user.last_state = "select_master";
                await user.save();
                await (0, selectMaster_1.select_master)(ctx, master);
            }
            else if (user.last_state == "getTimes") {
                user.last_state = "getSevenDays";
                user.paginationCount = 0;
                await user.save();
                await (0, getSevenDays_1.getSevenDeys)(ctx);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async onServices(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
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
                    await (0, services_1.services_mijoz)(ctx, service);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async selectServices(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            user.last_state = "select_service";
            user.service_id = +ctx.match["input"].split("-")[1];
            user.save();
            await ctx.reply(`Quyidagi kriteriyalar bo'yicha tanlang: `, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([
                ["ISMI 📝"],
                ["REYTING ⭐️"],
                ["Lokatsiya 📍"],
                ["orqaga ↩️"],
            ]).resize()));
        }
        catch (error) {
            console.log(error);
        }
    }
    async serachNameMijoz(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            if (user.last_state === "select_service") {
                user.searchType = "name";
                user.last_state = "searchNameService";
                await user.save();
                await (0, mijoz_ism_1.search_mijoz_ism)(ctx);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async serachRatingMijoz(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            if (user.last_state === "select_service") {
                user.searchType = "rating";
                user.last_state = "searchRatingService";
                await ctx.reply("Reyting bo'yicha:", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([["orqaga ↩️"]]).resize()));
                user.paginationCount = 0;
                user.message_id = String(ctx.message.message_id + 2);
                await user.save();
                await (0, searchRatingMaster_1.searchMasterRatingFirst)(ctx, user, this.masterRepository);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async selectMaster(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            if (user.last_state == "searchNameService" ||
                user.last_state == "searchRatingService" ||
                user.last_state == "searchLocationService") {
                const master = await this.masterRepository.findOne({
                    where: { master_id: ctx.match["input"].split("-")[1] },
                });
                if (!master) {
                    user.last_state = "main_mijoz";
                    await user.save();
                    return await (0, main_mijoz_1.mainMijoz)(ctx);
                }
                user.last_state = "select_master";
                user.selectMasterId = ctx.match["input"].split("-")[1];
                await ctx.telegram.deleteMessage(+user.user_id, +user.message_id);
                const newCtx = await (0, selectMaster_1.select_master)(ctx, master);
                user.message_id = String(newCtx.message_id);
                await user.save();
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async showLocation(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            if (user.last_state == "select_master") {
                const lat = ctx.match["input"].split("-")[1].split(",")[0];
                const lon = ctx.match["input"].split("-")[1].split(",")[1];
                await ctx.replyWithLocation(+lat, +lon, +user.user_id);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async toRankings(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            if (user.last_state == "select_master") {
                const ranking = await this.rankingRepository.findOne({
                    where: { user_id: user.user_id, master_id: user.selectMasterId },
                });
                user.last_state = "ranking";
                await user.save();
                await (0, toRanking_1.ranking_master)(ctx, ranking === null || ranking === void 0 ? void 0 : ranking.rank);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async getRank(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
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
                }
                else {
                    await this.rankingRepository.update({ rank }, {
                        where: {
                            user_id: user.user_id,
                            master_id: user.selectMasterId,
                        },
                    });
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
                    return await (0, main_mijoz_1.mainMijoz)(ctx);
                }
                master.rating = total_renk;
                await master.save();
                user.last_state = "select_master";
                await user.save();
                await (0, selectMaster_1.select_master)(ctx, master);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async getDays(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            if (user.last_state == "select_master") {
                user.last_state = "getSevenDays";
                await user.save();
                await (0, getSevenDays_1.getSevenDeys)(ctx);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async getTimes(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            if (user.last_state == "getSevenDays") {
                const master = await this.masterRepository.findOne({
                    where: { master_id: user.selectMasterId },
                });
                if (!master) {
                    user.last_state = "main_mijoz";
                    user.paginationCount = 0;
                    await user.save();
                    return await (0, main_mijoz_1.mainMijoz)(ctx);
                }
                await (0, getTime_1.get_times)(ctx, user, this.orderRepository, master);
                const ctxNew = await (0, timePagination_1.tima_paginationsFirst)(ctx, user);
                user.paginationCount = 0;
                await user.save();
                user.select_day = ctx.match["input"].split("-")[1];
                user.last_state = "getTimes";
                user.message_id = ctxNew.message_id;
                await user.save();
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async tanlanganHizmatlar(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            let orders = await this.orderRepository.findAll({
                where: { user_id: user.user_id },
            });
            if (orders.length) {
                orders.forEach(async (order) => {
                    const master = await this.masterRepository.findOne({
                        where: { master_id: order.master_id },
                    });
                    await (0, tanlanganHizmatlar_1.tanlangan_hizmatlar)(ctx, order, master);
                });
            }
            else {
                ctx.reply("Hali hech qaysi hizmatga ro'yhatdan o'tmagansiz");
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async sendSmsMaster(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            if (user.last_state == "getTimes") {
                const master = await this.masterRepository.findOne({
                    where: { master_id: user.selectMasterId },
                });
                if (!master) {
                    user.last_state = "main_mijoz";
                    user.paginationCount = 0;
                    await user.save();
                    return await (0, main_mijoz_1.mainMijoz)(ctx);
                }
                const order = await this.orderRepository.create({
                    user_id: user.user_id,
                    master_id: user.selectMasterId,
                    date: user.select_day,
                    time: ctx.match["input"].split("-")[1],
                    service_id: master.service_id,
                });
                await (0, sendMasterSms_1.sendSMSMaster)(ctx, user, order);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async confirmMessage(ctx) {
        try {
            let user = await this.userRepository.findOne({
                where: { user_id: String(ctx.from.id) },
            });
            if (!user) {
                return (0, boshMenu_1.boshMenu)(ctx);
            }
            const order = await this.orderRepository.findOne({
                where: { id: +ctx.match["input"].split("-")[1] },
            });
            if (order) {
                if (ctx.match["input"].split("-")[0] == "xa") {
                    ctx.telegram.sendMessage(+order.user_id, `${order.date}.${order.time}-vaqtiga yuborgan so'rovingiz qabul qilindi ✅`);
                    ctx.telegram.sendMessage(+order.master_id, `${order.date}.${order.time}-vaqtiga mijozni qabul qildingiz qabul qilindi ✅`);
                }
                else {
                    ctx.telegram.sendMessage(+order.user_id, `${order.date}.${order.time}-vaqtiga yuborgan so'rovingiz qabul qilinmadi ❌`);
                    ctx.telegram.sendMessage(+order.master_id, `${order.date}.${order.time}-vaqtiga mijozni qabul qilmadingiz ❌`);
                    await this.orderRepository.destroy({ where: { id: order.id } });
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __param(1, (0, sequelize_1.InjectModel)(service_type_model_1.Service_type)),
    __param(2, (0, sequelize_1.InjectModel)(master_model_1.Master)),
    __param(3, (0, sequelize_1.InjectModel)(order_model_1.Order)),
    __param(4, (0, sequelize_1.InjectModel)(admin_model_1.Admin)),
    __param(5, (0, sequelize_1.InjectModel)(ranking_model_1.Ranking)),
    __param(6, (0, nestjs_telegraf_1.InjectBot)(app_constants_1.MyBotName)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, telegraf_1.Telegraf])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map