"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const app_constants_1 = require("./app.constants");
const app_service_1 = require("./app.service");
const app_updates_1 = require("./app.updates");
const master_model_1 = require("./models/master.model");
const order_model_1 = require("./models/order.model");
const service_type_model_1 = require("./models/service_type.model");
const user_model_1 = require("./models/user.model");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_telegraf_1.TelegrafModule.forRootAsync({
                botName: app_constants_1.MyBotName,
                useFactory: () => ({
                    token: process.env.BOT_TOKEN,
                    middlewares: [],
                    include: [],
                }),
            }),
            config_1.ConfigModule.forRoot({
                envFilePath: `.env`,
            }),
            sequelize_1.SequelizeModule.forFeature([user_model_1.User, order_model_1.Order, service_type_model_1.Service_type, master_model_1.Master]),
            sequelize_1.SequelizeModule.forRoot({
                dialect: "postgres",
                host: process.env.POSTGRES_HOST,
                port: Number(process.env.POSTGRES_PORT),
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
                models: [user_model_1.User, order_model_1.Order, service_type_model_1.Service_type, master_model_1.Master],
                autoLoadModels: true,
                logging: false,
            }),
        ],
        providers: [app_service_1.AppService, app_updates_1.AppUpdate],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map