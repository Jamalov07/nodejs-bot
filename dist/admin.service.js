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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const app_constants_1 = require("./app.constants");
const user_model_1 = require("./models/user.model");
const service_type_model_1 = require("./models/service_type.model");
const master_model_1 = require("./models/master.model");
const order_model_1 = require("./models/order.model");
const admin_model_1 = require("./models/admin.model");
const messageToAdmin_1 = require("./helpers/messageToAdmin");
let AdminService = class AdminService {
    constructor(userRepository, serviceRepository, masterRepository, orderRepository, adminRepository, bot) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.masterRepository = masterRepository;
        this.orderRepository = orderRepository;
        this.adminRepository = adminRepository;
        this.bot = bot;
    }
    async commandAdmin(ctx) {
        const admin = await this.adminRepository.findOne({
            where: {
                admin_id: String(ctx.from.id)
            }
        });
        if (admin || ctx.from.id === Number(process.env.ADMIN_ID)) {
            await this.bot.telegram.sendChatAction(ctx.from.id, "typing");
            await (0, messageToAdmin_1.messageToAdmin)('Assalomu alaykum! Xush kelibsiz hurmatli admin', ctx);
        }
        else {
            await ctx.replyWithHTML('🚫 Siz admin emassiz <b>"/start"</b> tugmasi orqali odatiy menuga qaytib botdan foydalinishingiz mumkin');
        }
    }
    async showProperties(ctx) {
        await ctx.reply("Xizmatlarda qilishingiz mumkin bo'lgan imkoniyatlar", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard([
            ["⏬ Xizmat qo'shish", "🛂 Tahrirlash", "🗑 O'chirib tashlash"]
        ])
            .oneTime()
            .resize()));
    }
    async addServiceType(ctx) {
        const admin = await this.adminRepository.findOne({
            where: {
                admin_id: String(ctx.from.id)
            }
        });
        if (!admin) {
            await this.adminRepository.create({
                admin_id: '' + ctx.from.id,
                last_state: 'addnewService'
            });
        }
        admin.last_state = 'addnewService';
        await admin.save();
        await ctx.replyWithHTML('💁‍♂️ Marhamat yangi servisning nomini kiriting !');
    }
    async onMessage(ctx) {
        const admin = await this.adminRepository.findOne({
            where: {
                admin_id: String(ctx.from.id)
            }
        });
        if (admin.last_state == 'addnewService') {
            if ('text' in ctx.message) {
                await this.serviceRepository.create({
                    name: String(ctx.message.text)
                });
                admin.last_state = "finish";
                await admin.save();
                await ctx.reply('Muvaffaqiyatli qoshildi !', Object.assign({ parse_mode: 'HTML' }, telegraf_1.Markup.keyboard([
                    ["♻️ Yana qo'shish", "🏠 Bosh menyu"]
                ])
                    .oneTime()
                    .resize()));
            }
            else {
                await (0, messageToAdmin_1.messageToAdmin)('Bosh menyu', ctx);
            }
        }
        else if (admin.last_state === 'searchbynamemaster') {
            if ('text' in ctx.message) {
                const data = await this.masterRepository.findOne({
                    where: {
                        name: `${ctx.message.text}`,
                        service_id: admin.search_master_state
                    }
                });
                if (data) {
                    await ctx.reply(`Ismi: ${data.name}\naddress:${data.address}\nrating:${data.rating}\ntelefon raqami:${data.phone_number}\nxizmat narxi:${data.price}`, Object.assign({ parse_mode: 'HTML' }, telegraf_1.Markup.inlineKeyboard([
                        [telegraf_1.Markup.button.callback("❌ Ustani o'chirish", `delmaster=${data.master_id}`)],
                        [telegraf_1.Markup.button.callback("✔️ Ustani aktiv emas qilib qo'yish", `deactivemas=${data.master_id}`)],
                        [telegraf_1.Markup.button.callback("📊 Statistikani ko'rish", `showstats=${data.master_id}`)]
                    ])));
                    await telegraf_1.Markup.keyboard(["🏠 Bosh menyu"])
                        .oneTime()
                        .resize();
                }
                else {
                    admin.search_master_state = 0;
                    admin.last_state = 'finish';
                    await admin.save();
                    await ctx.replyWithHTML(`<b>Ushbu yo'nalishda bunday nomli user yo'q</b>`);
                    await this.complectMasters(ctx);
                }
            }
        }
        else if (admin.last_state === 'searchbynumbermaster') {
            if ('text' in ctx.message) {
                const data = await this.masterRepository.findOne({
                    where: {
                        phone_number: ctx.message.text,
                        service_id: admin.search_master_state
                    }
                });
                if (data) {
                    await ctx.reply(`Ismi: ${data.name}\naddress:${data.address}\nrating:${data.rating}\ntelefon raqami:${data.phone_number}\nxizmat narxi:${data.price}`, Object.assign({ parse_mode: 'HTML' }, telegraf_1.Markup.inlineKeyboard([
                        [telegraf_1.Markup.button.callback("❌ Ustani o'chirish", `delmaster=${data.master_id}`)],
                        [telegraf_1.Markup.button.callback("✔️ Ustani aktiv emas qilib qo'yish", `deactivemas=${data.master_id}`)],
                        [telegraf_1.Markup.button.callback("📊 Statistikani ko'rish", `showstats=${data.master_id}`)]
                    ])));
                    await telegraf_1.Markup.keyboard(["🏠 Bosh menyu"])
                        .oneTime()
                        .resize();
                }
                else {
                    admin.search_master_state = 0;
                    admin.last_state = 'finish';
                    await admin.save();
                    await ctx.replyWithHTML(`<b>Ushbu yo'nalishda bunday raqamli user yo'q</b>`);
                    await this.complectMasters(ctx);
                }
            }
        }
    }
    async toMainMenu(ctx) {
        await (0, messageToAdmin_1.messageToAdmin)('<b>Bosh menyu</b>', ctx);
    }
    async reAddNewItem(ctx) {
        await this.adminRepository.update({
            last_state: 'addnewService'
        }, {
            where: {
                admin_id: String(ctx.from.id)
            }
        });
        await ctx.reply('💁‍♂️ Marhamat yana bir bor yangi servis xizmati nomini kiriting !');
    }
    async seeMasters(ctx) {
        await this.complectMasters(ctx);
    }
    async hearsServiceFields(ctx) {
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if ("match" in ctx) {
            const admin = await this.adminRepository.findOne({
                where: {
                    admin_id: `${ctx.from.id}`
                }
            });
            const id = ctx.match[0].slice(7);
            admin.search_master_state = +id;
            await admin.save();
            await ctx.reply('Ustani ism yoki telefon raqam bilan izlashingiz mumkin!', Object.assign({ parse_mode: 'HTML' }, telegraf_1.Markup.keyboard([["🔍 Ism bo'yicha izlash"], ["📱 telefon raqami bo'yicha izlash"]])
                .oneTime()
                .resize()));
        }
    }
    async searchByName(ctx) {
        await this.adminRepository.update({
            last_state: 'searchbynamemaster'
        }, {
            where: {
                admin_id: `${ctx.from.id}`
            }
        });
        await ctx.reply('💁‍♂️ Marhamat ismni kiriting');
    }
    async searchByNumber(ctx) {
        await this.adminRepository.update({
            last_state: 'searchbynumbermaster'
        }, {
            where: {
                admin_id: `${ctx.from.id}`
            }
        });
        await ctx.reply('💁‍♂️ Marhamat telefon raqamini kiriting');
    }
    async complectMasters(ctx) {
        const services = await this.serviceRepository.findAll();
        let serviceNames = [];
        for (let i = 0; i < services.length; i++) {
            serviceNames.push([
                telegraf_1.Markup.button.callback(services[i].name, `fields=${services[i].id}`),
            ]);
        }
        serviceNames.push([telegraf_1.Markup.button.callback('🏠 Bosh menyu', 'mainmenu')]);
        await ctx.reply("Ustalarning yo'nalishlaridan birini tanlang", Object.assign({}, telegraf_1.Markup.inlineKeyboard([...serviceNames])));
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __param(1, (0, sequelize_1.InjectModel)(service_type_model_1.Service_type)),
    __param(2, (0, sequelize_1.InjectModel)(master_model_1.Master)),
    __param(3, (0, sequelize_1.InjectModel)(order_model_1.Order)),
    __param(4, (0, sequelize_1.InjectModel)(admin_model_1.Admin)),
    __param(5, (0, nestjs_telegraf_1.InjectBot)(app_constants_1.MyBotName)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, telegraf_1.Telegraf])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map