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
import { boshMenu } from "./helpers/boshMenu";
import {
  change_mijoz_ism,
  mijoz_ism,
  search_mijoz_ism,
} from "./helpers/mijoz_ism";
import { change_mijoz_phone, mijoz_phone } from "./helpers/mijoz_phone";
import { mainMijoz } from "./helpers/main_mijoz";
import {
  change_mijoz_data,
  select_service_data,
} from "./helpers/changeMijozData";
import { services_mijoz } from "./helpers/services";
import {
  searchMasterName,
  searchMasterNameFirst,
} from "./helpers/searchMasterName";
import {
  searchMasterRating,
  searchMasterRatingFirst,
} from "./helpers/searchRatingMaster";
import { search_mijoz_location } from "./helpers/searchMasterLocation";
import { getDistance } from "./helpers/distance";

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
    return await boshMenu(ctx);
  }

  async onMijoz(ctx: Context) {
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
      await mijoz_ism(ctx);
    } else if (!user?.real_name) {
      await mijoz_ism(ctx);
    } else if (!user?.phone_number) {
      user.last_state = "contact_mijoz";
      await user.save();
      await mijoz_phone(ctx);
    } else {
      user.last_state = "main_mijoz";
      await user.save();
      await mainMijoz(ctx);
    }
  }

  async onMessage(ctx) {
    if ("text" in ctx.message) {
      let user = await this.userRepository.findOne({
        where: { user_id: String(ctx.from.id) },
      });

      if (!user) {
        return boshMenu(ctx);
      }

      if (user.last_state === "register_mijoz") {
        user.real_name = ctx.message.text;
        user.last_state = "contact_mijoz";
        await user.save();
        mijoz_phone(ctx);
      } else if (user.last_state === "change_mijoz_name") {
        user.real_name = ctx.message.text;
        user.last_state = "change_mijoz";
        await user.save();
        ctx.reply(
          "Ism muvaffaqiyatli o'zgardi ✅, O'zgartirmoqchi bo'lgan ma'lumotingizni tanlang",
          {
            parse_mode: "HTML",
            ...Markup.keyboard([
              ["Ism, Familiya ✏️"],
              ["Telefon raqam 📞"],
              ["orqaga ↩️"],
            ]).resize(),
          }
        );
      } else if (user.last_state.split("-")[0] === "searchNameService") {
        const searchName = ctx.message.text;
        console.log("salom");
        await searchMasterNameFirst(
          ctx,
          user,
          this.masterRepository,
          0,
          searchName
        );
      }
    }
  }

  async onPaginationName(ctx) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }

    await searchMasterName(
      ctx,
      user,
      this.masterRepository,
      +ctx.match["input"].split("-")[1],
      ctx.match["input"].split("-")[2]
    );
  }
  async onPaginationRating(ctx) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }

    await searchMasterRating(
      ctx,
      user,
      this.masterRepository,
      +ctx.match["input"].split("-")[1]
    );
  }

  async onContact(ctx) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }
    if (user.last_state === "contact_mijoz") {
      user.phone_number = String(ctx.message.contact.phone_number);
      user.last_state = "main_mijoz";
      await user.save();
      await mainMijoz(ctx);
    } else if (user.last_state === "change_mijoz_phone") {
      user.phone_number = String(ctx.message.contact.phone_number);
      user.last_state = "change_mijoz";
      await user.save();
      ctx.reply(
        "Telefon raqam muvaffaqiyatli o'zgardi ✅, O'zgartirmoqchi bo'lgan ma'lumotingizni tanlang",
        {
          parse_mode: "HTML",
          ...Markup.keyboard([
            ["Ism, Familiya ✏️"],
            ["Telefon raqam 📞"],
            ["orqaga ↩️"],
          ]).resize(),
        }
      );
    }
  }

  async changeMijozData(ctx: Context) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }
    if (user.last_state == "main_mijoz") {
      user.last_state = "change_mijoz";
      await user.save();
      await change_mijoz_data(ctx);
    }
  }

  async changeName(ctx: Context) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }
    if (user.last_state == "change_mijoz") {
      user.last_state = "change_mijoz_name";
      await user.save();

      await change_mijoz_ism(ctx);
    }
  }

  async changeNumber(ctx: Context) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }
    if (user.last_state == "change_mijoz") {
      user.last_state = "change_mijoz_phone";
      await user.save();
      await change_mijoz_phone(ctx);
    }
  }
  async orqaga(ctx: Context) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }

    if (user.last_state == "change_mijoz") {
      user.last_state = "main_mijoz";
      await user.save();
      await mainMijoz(ctx);
    } else if (
      user.last_state == "change_mijoz_name" ||
      user.last_state == "change_mijoz_phone"
    ) {
      user.last_state = "change_mijoz";
      await user.save();
      await change_mijoz_data(ctx);
    } else if (user.last_state.split("-")[0] == "service") {
      user.last_state = "main_mijoz";
      await user.save();
      await mainMijoz(ctx);
    } else if (
      user.last_state.split("-")[0] == "searchNameService" ||
      user.last_state.split("-")[0] == "searchRatingService" ||
      user.last_state.split("-")[0] == "searchLocationService"
    ) {
      user.last_state = "service-" + user.last_state.split("-")[1];
      await user.save();
      await select_service_data(ctx);
    }
  }

  async onServices(ctx: Context) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
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
        await services_mijoz(ctx, service);
      }
    }
  }

  async selectServices(ctx) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }

    user.last_state = ctx.match["input"];
    user.save();

    await ctx.reply(`Quyidagi kriteriyalar bo'yicha tanlang: `, {
      parse_mode: "HTML",
      ...Markup.keyboard([
        ["ISMI 📝"],
        ["REYTING ⭐️"],
        ["Lokatsiya 📍"],
        ["orqaga ↩️"],
      ]).resize(),
    });
  }

  async serachNameMijoz(ctx) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }

    if (user.last_state.split("-")[0] === "service") {
      user.last_state = "searchNameService-" + user.last_state.split("-")[1];
      await user.save();
      await search_mijoz_ism(ctx);
    }
  }
  async serachRatingMijoz(ctx) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }

    if (user.last_state.split("-")[0] === "service") {
      user.last_state = "searchRatingService-" + user.last_state.split("-")[1];
      await ctx.reply("Reyting bo'yicha:", {
        parse_mode: "HTML",
        ...Markup.keyboard([["orqaga ↩️"]]).resize(),
      });
      await searchMasterRatingFirst(ctx, user, this.masterRepository, 0);
      user.message_id = String(ctx.message.message_id + 2);
      await user.save();
    }
  }
  async getLocation(ctx) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }
    const lon = ctx.message.location.longitude;
    const lat = ctx.message.location.latitude;
    user.location = `${lat},${lon}`;
    const results = await this.masterRepository.findAll({
      where: {
        service_id: +user.last_state.split("-")[1],
      },
    });
    const distances = [];
    results.forEach(async (result) => {
      let to_lat = result.location.split(",")[0];
      let to_lon = result.location.split(",")[1];
      const distance = await getDistance(lat, lon, to_lat, to_lon);
      distances.push({
        id: result.master_id,
        distance: distance,
        name: result.name,
      });
    });

    distances.sort((a, b) => a.distance - b.distance);
    user.distance = JSON.stringify(distances);
    await user.save();
  }

  async onLocation(ctx) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }

    if (user.last_state.split("-")[0] === "service") {
      user.last_state = "searchNameLocation-" + user.last_state.split("-")[1];
      await user.save();
      await search_mijoz_location(ctx);
    }
  }
}
