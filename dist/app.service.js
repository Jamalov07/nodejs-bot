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
let AppService = class AppService {
    constructor(userRepository, serviceRepository, masterRepository, orderRepository, bot) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.masterRepository = masterRepository;
        this.orderRepository = orderRepository;
        this.bot = bot;
    }
    async onStart(ctx) {
        console.log("11111");
        const user = await this.userRepository.findOne({
            where: { user_id: `${ctx.from.id}` },
        });
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if (user) {
        }
        else if (master) {
            if (master.status && master.last_state === "finish") {
                await ctx.reply("O'zingizga kerakli bo'lgan bo'limni tanlang", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([
                    ["👥 Mijozlar", "🕔 Vaqt", "📊 Reyting"],
                    ["🔄 Ma'lumotlarni o'zgartirish"],
                ])
                    .oneTime()
                    .resize()));
            }
        }
        else {
            await ctx.reply("Assalomu alaykum. Hush kelibsiz, botdan birinchi martda foydalanayotganingiz uchun ro'yhatdan o'tishingiz lozim", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([["👤 Ro'yhatdan o'tish"]])
                .oneTime()
                .resize()));
        }
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
        if ("text" in ctx.message) {
            if (user) {
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
        const user = await this.userRepository.findOne({
            where: { user_id: `${ctx.from.id}` },
        });
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if ("location" in ctx.message) {
            if (user) {
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
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __param(1, (0, sequelize_1.InjectModel)(service_type_model_1.Service_type)),
    __param(2, (0, sequelize_1.InjectModel)(master_model_1.Master)),
    __param(3, (0, sequelize_1.InjectModel)(order_model_1.Order)),
    __param(4, (0, nestjs_telegraf_1.InjectBot)(app_constants_1.MyBotName)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, telegraf_1.Telegraf])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map