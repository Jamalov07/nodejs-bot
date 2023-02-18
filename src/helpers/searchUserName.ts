import { Op } from "sequelize";
import { Markup } from "telegraf";

export async function searchUserName(
  ctx,
  user,
  masterRepo,
  count,
  searchName
) {
  const results = await masterRepo.findAll({
    offset: 10 * count,
    limit: 10,
    where: {
      [Op.and]: [
        { service_id: +user.last_state.split("-")[1] },
        { name: { [Op.iLike]: `%${searchName}%` } },
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
        callback_data: `prevMastersName-${count - 1}-${searchName}`,
      },
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersName-${count + 1}-${searchName}`,
      },
    ]);
  } else if (results.length == 10) {
    masters.push([
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersName-${count + 1}-${searchName}`,
      },
    ]);
  } else if (results.length < 10) {
    masters.push([
      {
        text: "⏪ Orqaga",
        callback_data: `prevMastersName-${count - 1}-${searchName}`,
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
}
export async function searchMasterNameFirst(
  ctx,
  user,
  masterRepo,
  count,
  searchName
) {
  const results = await masterRepo.findAll({
    offset: 10 * count,
    limit: 10,
    where: {
      [Op.and]: [
        { service_id: +user.last_state.split("-")[1] },
        { name: { [Op.iLike]: `%${searchName}%` } },
      ],
    },
  });
  const masters = [];
  console.log(results.length);
  if (!results.length) {
    return await ctx.reply("Hechkim topilmadi, Qaytadan urinib ko'ring");
  }
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
        callback_data: `prevMastersName-${count - 1}-${searchName}`,
      },
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersName-${count + 1}-${searchName}`,
      },
    ]);
  } else if (results.length == 10) {
    masters.push([
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersName-${count + 1}-${searchName}`,
      },
    ]);
  } else if (results.length < 10 && count != 0) {
    masters.push([
      {
        text: "⏪ Orqaga",
        callback_data: `prevMastersName-${count - 1}-${searchName}`,
      },
    ]);
  }

  await ctx.reply("Natijalar:", {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([...masters]),
  });
}