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
import {
  search_mijoz_location,
  show_mijoz_location,
  show_mijoz_locationsFirst,
} from "./helpers/searchMasterLocation";
import { getDistance } from "./helpers/distance";
import { select_master } from "./helpers/selectMaster";
import { Ranking } from "./models/ranking.model";
import { ranking_master } from "./helpers/toRanking";

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Service_type) private serviceRepository: typeof Service_type,
    @InjectModel(Master) private masterRepository: typeof Master,
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectModel(Ranking) private rankingRepository: typeof Ranking,
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
      } else if (user.last_state === "searchNameService") {
        const searchName = ctx.message.text;
        user.paginationCount = 0;
        user.searchName = searchName;
        await user.save();
        await searchMasterNameFirst(ctx, user, this.masterRepository);
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

    user.paginationCount = +ctx.match["input"].split("-")[1];
    await user.save();
    await searchMasterName(ctx, user, this.masterRepository);
  }
  async onPaginationRating(ctx) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }
    user.paginationCount = +ctx.match["input"].split("-")[1];
    await user.save();
    await searchMasterRating(ctx, user, this.masterRepository);
  }
  async onPaginationLocation(ctx) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }
    user.paginationCount = +ctx.match["input"].split("-")[1];
    await user.save();
    await show_mijoz_location(ctx, user);
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
    } else if (user.last_state == "select_service") {
      user.last_state = "main_mijoz";
      await user.save();
      await mainMijoz(ctx);
    } else if (
      user.last_state == "searchNameService" ||
      user.last_state == "searchRatingService" ||
      user.last_state == "searchLocationService"
    ) {
      user.last_state = "select_service";
      await user.save();
      await select_service_data(ctx);
    } else if (user.last_state == "select_master") {
      await ctx.telegram.deleteMessage(+user.user_id, +user.message_id);

      if (user.searchType == "name") {
        user.last_state = "searchNameService";
        const newCtx = await searchMasterNameFirst(
          ctx,
          user,
          this.masterRepository
        );
        user.message_id = String(newCtx.message_id);
        await user.save();
      } else if (user.searchType == "location") {
        user.last_state = "searchLocationService";
        const newCtx = await show_mijoz_locationsFirst(ctx, user);
        user.message_id = String(newCtx.message_id);
        await user.save();
      } else if (user.searchType == "rating") {
        user.last_state = "searchRatingService";
        const newCtx = await searchMasterRatingFirst(
          ctx,
          user,
          this.masterRepository
        );
        user.message_id = String(newCtx.message_id);
        await user.save();
      }
    } else if (user.last_state == "ranking") {
      const master = await this.masterRepository.findOne({
        where: { master_id: user.selectMasterId },
      });
      if (!master) {
        user.last_state = "main_mijoz";
        await user.save();
        return await mainMijoz(ctx);
      }
      user.last_state = "select_master";
      await user.save();
      await select_master(ctx, master);
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

    user.last_state = "select_service";
    user.service_id = +ctx.match["input"].split("-")[1];
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

    if (user.last_state === "select_service") {
      user.searchType = "name";
      user.last_state = "searchNameService";
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

    if (user.last_state === "select_service") {
      user.searchType = "rating";
      user.last_state = "searchRatingService";
      await ctx.reply("Reyting bo'yicha:", {
        parse_mode: "HTML",
        ...Markup.keyboard([["orqaga ↩️"]]).resize(),
      });

      user.paginationCount = 0;
      user.message_id = String(ctx.message.message_id + 2);
      await user.save();
      await searchMasterRatingFirst(ctx, user, this.masterRepository);
    }
  }
  async getLocation(ctx) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }
    if (user.last_state === "searchLocationService") {
      const lon = ctx.message.location.longitude;
      const lat = ctx.message.location.latitude;
      user.location = `${lat},${lon}`;
      const results = await this.masterRepository.findAll({
        where: {
          service_id: +user.service_id,
        },
      });
      const distances = [];
      for (const result of results) {
        let to_lat = result.location?.split(",")[0];
        let to_lon = result.location?.split(",")[1];
        if (to_lat && to_lon) {
          const distance = await getDistance(lat, lon, to_lat, to_lon);
          distances.push({
            id: result.master_id,
            distance: distance,
            name: result.name,
          });
        }
      }

      distances.sort((a, b) => a.distance - b.distance);
      user.distance = JSON.stringify(distances);
      user.message_id = String(ctx.message.message_id + 2);
      user.changed("distance", true);
      user.paginationCount = 0;
      await user.save();
      await ctx.reply("Lokatsiya bo'yicha:", {
        parse_mode: "HTML",
        ...Markup.keyboard([["orqaga ↩️"]]).resize(),
      });

      await show_mijoz_locationsFirst(ctx, user);
    }
  }

  async onLocation(ctx) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }

    if (user.last_state === "select_service") {
      user.searchType = "location";

      user.last_state = "searchLocationService";
      await user.save();
      await search_mijoz_location(ctx);
    }
  }

  async selectMaster(ctx) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }

    if (
      user.last_state == "searchNameService" ||
      user.last_state == "searchRatingService" ||
      user.last_state == "searchLocationService"
    ) {
      const master = await this.masterRepository.findOne({
        where: { master_id: ctx.match["input"].split("-")[1] },
      });
      if (!master) {
        user.last_state = "main_mijoz";
        await user.save();
        return await mainMijoz(ctx);
      }

      user.last_state = "select_master";
      user.selectMasterId = ctx.match["input"].split("-")[1];
      await ctx.telegram.deleteMessage(+user.user_id, +user.message_id);
      const newCtx = await select_master(ctx, master);
      user.message_id = String(newCtx.message_id);
      await user.save();
    }
  }

  async showLocation(ctx) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }
    if (user.last_state == "select_master") {
      const lat = ctx.match["input"].split("-")[1].split(",")[0];
      const lon = ctx.match["input"].split("-")[1].split(",")[1];
      await ctx.replyWithLocation(+lat, +lon, +user.user_id);
    }
  }

  async toRankings(ctx) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }
    if (user.last_state == "select_master") {
      const ranking = await this.rankingRepository.findOne({
        where: { user_id: user.user_id, master_id: user.selectMasterId },
      });
      user.last_state = "ranking";
      await user.save();
      await ranking_master(ctx, ranking?.rank);
    }
  }

  async getRank(ctx) {
    let user = await this.userRepository.findOne({
      where: { user_id: String(ctx.from.id) },
    });

    if (!user) {
      return boshMenu(ctx);
    }
    if (user.last_state == "ranking") {
      const rank = +ctx.match["input"].split("-")[1];
      let ranking = await this.rankingRepository.findOne({
        where: { user_id: user.user_id, master_id: user.selectMasterId },
      });
      if (!ranking) {
        ranking = await this.rankingRepository.create({
          user_id: user.user_id,
          master_id: user.selectMasterId,
          rank,
        });
      } else {
        await this.rankingRepository.update(
          { rank },
          {
            where: {
              user_id: user.user_id,
              master_id: user.selectMasterId,
            },
          }
        );
      }
      const ranks = await this.rankingRepository.findAll({
        where: { master_id: user.selectMasterId },
      });
      const total_renk = ranks.reduce((a, b) => a + b.rank, 0) / ranks.length;
      console.log(total_renk);
      const master = await this.masterRepository.findOne({
        where: { master_id: user.selectMasterId },
      });
      if (!master) {
        user.last_state = "main_mijoz";
        await user.save();
        return await mainMijoz(ctx);
      }
      master.rating = total_renk;
      await master.save();

      user.last_state = "select_master";
      await user.save();
      await select_master(ctx, master);
    }
  }
}
