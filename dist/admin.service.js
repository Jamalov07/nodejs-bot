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