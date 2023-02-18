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
const messageMaster_menu_1 = require("./helpers/messageMaster.menu");
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
                        service_id: admin.search_master_state,
                        status: true
                    }
                });
                if (data) {
                    await this.adminRepository.update({
                        last_state: 'finish'
                    }, {
                        where: {
                            admin_id: `${ctx.from.id}`
                        }
                    });
                    await ctx.reply(`Ismi: <b>${data.name}</b>\naddress:<b>${data.address}</b>\nrating:<b>${data.rating}</b>\ntelefon raqami:<b>${data.phone_number}</b>\nxizmat narxi:<b>${data.price}</b>`, Object.assign({ parse_mode: 'HTML' }, telegraf_1.Markup.inlineKeyboard([
                        [telegraf_1.Markup.button.callback("❌ Ustani o'chirish", `delmaster=${data.master_id}`)],
                        [telegraf_1.Markup.button.callback("✔️ Ustani aktiv emas qilib qo'yish", `deactivemas=${data.master_id}`)],
                        [telegraf_1.Markup.button.callback("📊 Statistikani ko'rish", `showstats=${data.master_id}`)],
                        [telegraf_1.Markup.button.callback("📝 Ustaga reklama yoki xabar yuborish", `sendmess=${data.master_id}`)],
                        [telegraf_1.Markup.button.callback("🏠 Bosh menyu", 'mainmenu')]
                    ])));
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
                        service_id: admin.search_master_state,
                        status: true
                    }
                });
                if (data) {
                    await ctx.reply(`Ismi: <b>${data.name}</b>\naddress:<b>${data.address}</b>\nrating:<b>${data.rating}</b>\ntelefon raqami:<b>${data.phone_number}</b>\nxizmat narxi:<b>${data.price}</b>`, Object.assign({ parse_mode: 'HTML' }, telegraf_1.Markup.inlineKeyboard([
                        [telegraf_1.Markup.button.callback("❌ Ustani o'chirish", `delmaster=${data.master_id}`)],
                        [telegraf_1.Markup.button.callback("✔️ Ustani aktiv emas qilib qo'yish", `deactivemas=${data.master_id}`)],
                        [telegraf_1.Markup.button.callback("📊 Statistikani ko'rish", `showstats=${data.master_id}`)],
                        [telegraf_1.Markup.button.callback("📝 Ustaga reklama yoki xabar yuborish", `sendmess=${data.master_id}`)],
                        [telegraf_1.Markup.button.callback("🏠 Bosh menyu", 'mainmenu')]
                    ])));
                }
                else {
                    admin.search_master_state = 0;
                    admin.last_state = 'finish';
                    await admin.save();
                    await ctx.replyWithHTML(`<b>Ushbu yo'nalishda bunday raqamli user yo'q</b>`);
                    await (0, messageMaster_menu_1.messageMasterMenu)(data.master_id, 'Yonalishlardan birini tanlashingiz mumkin', ctx);
                }
            }
        }
        else if (admin.last_state == 'sendMessage') {
            if ('text' in ctx.message) {
                await ctx.telegram.sendMessage(admin.target_user_id, `<b>Xurmatli mutahassis! Sizga admin tomonidan xabar yuborildi</b>:\n${ctx.message.text}`, {
                    parse_mode: 'HTML'
                });
                await ctx.reply('✍️ Ustaga xabaringiz yuborildi');
                await this.complectMasters(ctx);
            }
        }
        else if (admin.last_state == "updatefield") {
            if ('text' in ctx.message) {
                await this.serviceRepository.update({
                    name: String(ctx.message.text)
                }, {
                    where: {
                        id: admin.target_service_type_id
                    }
                });
                admin.last_state = 'finish';
                await admin.save();
                await ctx.reply('Muvvafiqatli ozgartirildi !\n Davom etish uchun quyidagi buttonlardan birini tanlang', Object.assign({ parse_mode: 'HTML' }, telegraf_1.Markup.keyboard(["🔄 Yana boshqa service typeni o'zgartirish", "🏠 Bosh menyu"])
                    .oneTime()
                    .resize()));
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
        await ctx.reply('💁‍♂️ Marhamat telefon raqamini kiriting\n Misol uchun : +998901234567');
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
    async deleteMaster(ctx) {
        if ("match" in ctx) {
            const id = ctx.match[0].slice(10);
            console.log(id);
            await this.masterRepository.destroy({
                where: {
                    master_id: id
                }
            });
            await ctx.reply(`Usta aktivi o'chirildi`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard(["🏠 Bosh menyu", "🛠 Yo'nalishlar ro'yxatiga qaytish"])
                .oneTime()
                .resize()));
        }
    }
    async deActiveMaster(ctx) {
        if ("match" in ctx) {
            const id = ctx.match[0].slice(12);
            await this.masterRepository.update({
                status: false
            }, {
                where: {
                    master_id: `${id}`
                }
            });
            await ctx.reply(`Usta aktivi o'chirildi`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard(["🏠 Bosh menyu", "🛠 Yo'nalishlar ro'yxatiga qaytish"])
                .oneTime()
                .resize()));
        }
    }
    async sendMessage(ctx) {
        if ("match" in ctx) {
            const id = ctx.match[0].slice(9);
            await this.adminRepository.update({
                last_state: 'sendMessage',
                target_user_id: id
            }, {
                where: {
                    admin_id: `${ctx.from.id}`
                }
            });
            await ctx.reply("💁‍♂️ Ustaga nima deb yozishni kiriting !");
        }
    }
    async showStatics(ctx) {
        if ("match" in ctx) {
            const id = ctx.match[0].slice(10);
            const order = await this.orderRepository.findAll({
                where: {
                    master_id: id
                }, include: { all: true }
            });
            const master = await this.masterRepository.findAll({
                where: {
                    master_id: id
                }, include: { all: true }
            });
            const myString = master[0].dataValues.price;
            const myNumber = parseFloat(myString.replace(/[^\d.]/g, ''));
            const countSum = myNumber * order.length;
            const countTax = ((countSum * 30) / 100) * 5;
            await ctx.reply(`🔄 <b>Zakazlar soni</b> : ${order.length}\n💸 <b>narxi:</b>${master[0].dataValues.price}\n<b>🤑 Tahminan kunlik ishlaydigan summasi:</b>${countSum} ming so'm\n💰 <b>Ustadan necha pul soliq olish mumkin:</b>${countTax}ming so'm\n<b>💵 Tahminan oylik summasi</b>:${(countSum * 30) / 1000} million so'm`, {
                parse_mode: 'HTML'
            });
            await (0, messageMaster_menu_1.messageMasterMenu)(master[0].dataValues.master_id, 'Yonalishlardan birini tanlashingiz mumkin', ctx);
        }
    }
    async changeFields(ctx) {
        const services = await this.serviceRepository.findAll();
        let serviceNames = [];
        for (let i = 0; i < services.length; i++) {
            serviceNames.push([
                telegraf_1.Markup.button.callback(services[i].name, `changefield=${services[i].id}`),
            ]);
        }
        await ctx.reply("O'zgartirish uchun sohani tanlang", Object.assign({}, telegraf_1.Markup.inlineKeyboard([...serviceNames])));
    }
    async deleteFields(ctx) {
        const services = await this.serviceRepository.findAll();
        let serviceNames = [];
        for (let i = 0; i < services.length; i++) {
            serviceNames.push([
                telegraf_1.Markup.button.callback(services[i].name, `deletefield=${services[i].id}`),
            ]);
        }
        await ctx.reply("O'chirish uchun sohani tanlang", Object.assign({}, telegraf_1.Markup.inlineKeyboard([...serviceNames])));
    }
    async removeFields(ctx) {
        if ("match" in ctx) {
            const id = ctx.match[0].slice(12);
            await this.serviceRepository.destroy({
                where: {
                    id: +id
                }
            });
            await ctx.reply(`Service turi o'chirildi`, Object.assign({ parse_mode: 'HTML' }, telegraf_1.Markup.keyboard(["🗑 Yana boshqa service turini o'chirib tashlash", "🏠 Bosh menyu"])
                .oneTime()
                .resize()));
        }
    }
    async updateFields(ctx) {
        if ("match" in ctx) {
            const id = ctx.match[0].slice(12);
            console.log(id);
            await this.adminRepository.update({
                last_state: 'updatefield',
                target_service_type_id: id
            }, {
                where: {
                    admin_id: ctx.from.id
                }
            });
            await ctx.reply('💁‍♂️ Marhamat, yangi nomni yozing');
        }
    }
    async seeUsers(ctx) {
        await ctx.reply('Userlarni korish uchun, ism yoki telefon raqam bilan izlashingiz mumkin', Object.assign({ parse_mode: 'HTML' }, telegraf_1.Markup.keyboard(["📱 Telefon raqam orqali", "🔎 Ism orqali izlash"])
            .oneTime()
            .resize()));
    }
    async searchUserByPhone(ctx) {
        await this.adminRepository.update({
            last_state: 'userbyphone',
        }, {
            where: {
                admin_id: `${ctx.from.id}`
            }
        });
        await ctx.replyWithHTML('💁‍♂️ <b>Marhamat, userning telefon raqamini kiriting</b>');
    }
    async searchUserByName(ctx) {
        await this.adminRepository.update({
            last_state: 'userbyname',
        }, {
            where: {
                admin_id: `${ctx.from.id}`
            }
        });
        await ctx.replyWithHTML('💁‍♂️ <b>Marhamat, userning ismini kiriting</b>');
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