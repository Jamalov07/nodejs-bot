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

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Service_type) private serviceRepository: typeof Service_type,
    @InjectModel(Master) private masterRepository: typeof Master,
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectBot(MyBotName) private readonly bot: Telegraf<Context>
  ) {}
}
