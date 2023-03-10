import { Op } from "sequelize";
import { Markup } from "telegraf";
import { User } from "../models/user.model";

export async function searchMasterName(ctx, user, masterRepo) {
  try {
    const count = user.paginationCount;

    const results = await masterRepo.findAll({
      offset: 10 * count,
      limit: 10,
      where: {
        [Op.and]: [
          { service_id: user.service_id },
          { name: { [Op.iLike]: `%${user.searchName}%` } },
        ],
      },
    });
    const masters = [];

    for (let i = 0; i < results.length; i++) {
      masters.push([
        {
          text: `${
            results[i].name + " " + "⭐️".repeat(Math.round(results[i].rating))
          }`,
          callback_data: `master-${results[i].master_id}`,
        },
      ]);
    }

    if (count != 0 && results.length == 10) {
      masters.push([
        {
          text: "⏪ Orqaga",
          callback_data: `prevMastersName-${count - 1}`,
        },
        {
          text: "keyingisi ⏩",
          callback_data: `prevMastersName-${count + 1}`,
        },
      ]);
    } else if (results.length == 10) {
      masters.push([
        {
          text: "keyingisi ⏩",
          callback_data: `prevMastersName-${count + 1}`,
        },
      ]);
    } else if (results.length < 10) {
      masters.push([
        {
          text: "⏪ Orqaga",
          callback_data: `prevMastersName-${count - 1}`,
        },
      ]);
    }

    await ctx.telegram.editMessageText(
      +user.user_id,
      +user.message_id,
      null,
      "Natijalar: ",
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([...masters]),
      }
    );
  } catch (error) {
    console.log(error);
  }
}
export async function searchMasterNameFirst(ctx, user: User, masterRepo) {
  try {
    const count = user.paginationCount;
    const results = await masterRepo.findAll({
      offset: 10 * count,
      limit: 10,
      where: {
        [Op.and]: [
          { service_id: user.service_id },
          { name: { [Op.iLike]: `%${user.searchName}%` } },
        ],
      },
    });
    const masters = [];
    if (!results.length) {
      return await ctx.reply("Hechkim topilmadi, Qaytadan urinib ko'ring");
    }
    if (ctx.message?.message_id)
      user.message_id = String(ctx.message.message_id + 1);
    await user.save();
    for (let i = 0; i < results.length; i++) {
      masters.push([
        {
          text: `${
            results[i].name + " " + "⭐️".repeat(Math.round(results[i].rating))
          }`,
          callback_data: `master-${results[i].master_id}`,
        },
      ]);
    }

    if (count != 0 && results.length == 10) {
      masters.push([
        {
          text: "⏪ Orqaga",
          callback_data: `prevMastersName-${count - 1}`,
        },
        {
          text: "keyingisi ⏩",
          callback_data: `prevMastersName-${count + 1}`,
        },
      ]);
    } else if (results.length == 10) {
      masters.push([
        {
          text: "keyingisi ⏩",
          callback_data: `prevMastersName-${count + 1}`,
        },
      ]);
    } else if (results.length < 10 && count != 0) {
      masters.push([
        {
          text: "⏪ Orqaga",
          callback_data: `prevMastersName-${count - 1}`,
        },
      ]);
    }
    return await ctx.reply("Natijalar:", {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([...masters]),
    });
  } catch (error) {
    console.log(error);
  }
}
