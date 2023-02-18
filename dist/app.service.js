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
                serviceNames.push([services[i].name]);
            }
            await ctx.reply("O'zingizning sohangizni tanlang", Object.assign({}, telegraf_1.Markup.keyboard([...serviceNames])
                .oneTime()
                .resize()));
        }
    }
    async hearsServiceTypes(ctx) {
        const master = await this.masterRepository.findOne({
            where: { master_id: `${ctx.from.id}` },
        });
        if ("text" in ctx.message) {
            if (master && master.last_state === "service_type") {
                const services = await service_type_model_1.Service_type.findAll();
                let serviceNames = [];
                for (let i = 0; i < services.length; i++) {
                    serviceNames.push(services[i].name);
                }
                if (serviceNames.includes(ctx.message.text)) {
                    console.log(ctx.message.text);
                }
            }
            else {
                await ctx.reply("/start");
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