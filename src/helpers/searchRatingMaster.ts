import { Op } from "sequelize";
import { Markup } from "telegraf";

export async function searchMasterRating(ctx, user, masterRepo, count) {
  const results = await masterRepo.findAll({
    offset: 10 * count,
    limit: 10,
    where: {
      service_id: +user.last_state.split("-")[1],
    },
    order: [["rating", "DESC"]],
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
        callback_data: `prevMastersRating-${count - 1}`,
      },
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersRating-${count + 1}`,
      },
    ]);
  } else if (results.length == 10) {
    masters.push([
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersRating-${count + 1}`,
      },
    ]);
  } else if (results.length < 10) {
    masters.push([
      {
        text: "⏪ Orqaga",
        callback_data: `prevMastersRating-${count - 1}`,
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
export async function searchMasterRatingFirst(ctx, user, masterRepo, count) {
  const results = await masterRepo.findAll({
    offset: 10 * count,
    limit: 10,
    where: {
      service_id: +user.last_state.split("-")[1],
    },
    order: [["rating", "DESC"]],
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
        callback_data: `prevMastersRating-${count - 1}`,
      },
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersRating-${count + 1}`,
      },
    ]);
  } else if (results.length == 10) {
    masters.push([
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersRating-${count + 1}`,
      },
    ]);
  } else if (results.length < 10 && count != 0) {
    masters.push([
      {
        text: "⏪ Orqaga",
        callback_data: `prevMastersRating-${count - 1}`,
      },
    ]);
  }

  await ctx.reply("Natijalar:", {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([...masters]),
  });
}
