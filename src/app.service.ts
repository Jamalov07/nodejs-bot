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
import { services } from "./helpers/services";

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Service_type) private serviceRepository: typeof Service_type,
    @InjectModel(Master) private masterRepository: typeof Master,
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectBot(MyBotName) private readonly bot: Telegraf<Context>
  ) {}

  async onStart(ctx: Context) {
    const user = await this.userRepository.findOne({
      where: { user_id: `${ctx.from.id}` },
    });
    if (user) {
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
        last_state: "service_type",
      });

      const services = await this.serviceRepository.findAll();
      let serviceNames = [];
      for (let i = 0; i < services.length; i++) {
        serviceNames.push([services[i].name]);
      }
      await ctx.reply("O'zingizning sohangizni tanlang", {
        ...Markup.keyboard([...serviceNames])
          .oneTime()
          .resize(),
      });
    }
  }

  async hearsServiceTypes(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if ("text" in ctx.message) {
      if (master && master.last_state === "service_type") {
        const services = await Service_type.findAll();
        let serviceNames = [];
        for (let i = 0; i < services.length; i++) {
          serviceNames.push(services[i].name);
        }
        if (serviceNames.includes(ctx.message.text)) {
          console.log(ctx.message.text);
        }
      } else {
        await ctx.reply("/start");
      }
    }
  }
}
