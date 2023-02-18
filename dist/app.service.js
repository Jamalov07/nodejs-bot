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
        const user = await this.userRepository.findOne({
            where: { user_id: `${ctx.from.id}` },
        });
        if (user) {
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
                last_state: "service_type",
            });
            const services = await this.serviceRepository.findAll();
            let serviceNames = [];
            for (let i = 0; i < services.length; i++) {
                serviceNames.push([
                    telegraf_1.Markup.button.callback(services[i].name, `thisservice=${services[i].id}`),
                ]);
            }
            await ctx.reply("O'zingizning sohangizni tanlang", Object.assign({}, telegraf_1.Markup.inlineKeyboard([...serviceNames])));
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
                    await ctx.reply("Ismingizni kiriting");
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
                        telegraf_1.Markup.button.contactRequest("📲 Raqam yuborish"),
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
                        await ctx.reply("Ish tugatish vaqtingizni kiriting. Namuna (`21:00`)");
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
                        await master.update({
                            work_start_time: ctx.message.text,
                            last_state: "time_per",
                        });
                        await ctx.reply("Bir mijoz uchun maksimal sarflaydigan vaqtingizni minutda kiriting. maksimal 1 soat Namuna (`30`)");
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
                        await ctx.reply(masterInfo, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
                            [telegraf_1.Markup.button.callback("✅ Tasdiqlash", `reqtoadmin`)],
                            [telegraf_1.Markup.button.callback("❌ Bekor qilish", `delmyinfo`)],
                        ])));
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
                        await ctx.reply("Ustaxona nomi bo'lsa kiriting (ixtiyoriy)", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard(["⏭ keyingisi"]).oneTime().resize()));
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
                await ctx.reply("Ustaxona to'liq manzilini kiriting", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard(["⏭ keyingisi"]).oneTime().resize()));
            }
            else if (master.last_state === "address") {
                master.update({ last_state: "target_address" });
                await ctx.reply("Mo'lljalni kiriting", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard(["⏭ keyingisi"]).oneTime().resize()));
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
                    await ctx.reply("Ish boshlash vaqtingizni kiriting. Namuna(`07:00`)");
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
        if ("match" in ctx) {
            if (user) {
            }
            else if (master) {
                if (master.last_state === "finish") {
                    const serviceName = master.service_name
                        ? `\nUstaxona nomi: ${master.service_name}`
                        : "";
                    const address = master.address ? `\nManzili: ${master.address}` : "";
                    const target = master.target_address
                        ? `\nMo'ljal: ${master.target_address}`
                        : "";
                    const masterInfo = `Ismi: ${master.name}\nTelefon raqami: ${master.phone_number}${serviceName}${address}${target}`;
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
    }
    async cancelRegistration(ctx) {
        const user = await this.userRepository.findOne({
            where: { user_id: `${ctx.from.id}` },
        });
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if ("match" in ctx) {
            if (user) {
            }
            else if (master) {
                await master.destroy();
            }
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
                    ["Mijozlar", "Vaqt", "Reyting"],
                    ["Ma'lumotlarni o'zgartirish"],
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