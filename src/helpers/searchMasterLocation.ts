import { Context, Markup } from "telegraf";

export async function search_mijoz_location(ctx: Context) {
  await ctx.reply("'Locatsiyani yuborish 📍' tugmasini bosing", {
    parse_mode: "HTML",
    ...Markup.keyboard([
      [Markup.button.locationRequest("Locatsiyani yuborish 📍")],
      ["orqaga ↩️"],
    ]).resize(),
  });
}

export async function show_mijoz_location(ctx, user) {
  const distances = JSON.parse(user.distance);
  const count = user.paginationCount;

  const results = distances.slice(10 * count, 10 * (count + 1));
  const masters = [];

  for (const result of results) {
    masters.push([
      {
        text: `${result.name}-${result.distance} km`,
        callback_data: `master-${result.id}`,
      },
    ]);
  }
  if (count != 0 && results.length == 10) {
    masters.push([
      {
        text: "⏪ Orqaga",
        callback_data: `prevMastersLocation-${count - 1}`,
      },
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersLocation-${count + 1}`,
      },
    ]);
  } else if (results.length == 10) {
    masters.push([
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersLocation-${count + 1}`,
      },
    ]);
  } else if (results.length < 10 && count != 0) {
    masters.push([
      {
        text: "⏪ Orqaga",
        callback_data: `prevMastersLocation-${count - 1}`,
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
export async function show_mijoz_locationsFirst(ctx, user) {
  const count = user.paginationCount;

  const masters = [];
  const distances = JSON.parse(user.distance);
  const results = distances.slice(10 * count, 10 * (count + 1));

  for (const result of results) {
    masters.push([
      {
        text: `${result.name}-${result.distance} km`,
        callback_data: `master-${result.id}`,
      },
    ]);
  }
  if (count != 0 && results.length == 10) {
    masters.push([
      {
        text: "⏪ Orqaga",
        callback_data: `prevMastersLocation-${count - 1}`,
      },
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersLocation-${count + 1}`,
      },
    ]);
  } else if (results.length == 10) {
    masters.push([
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersLocation-${count + 1}`,
      },
    ]);
  } else if (results.length < 10 && count != 0) {
    masters.push([
      {
        text: "⏪ Orqaga",
        callback_data: `prevMastersLocation-${count - 1}`,
      },
    ]);
  }

  return await ctx.reply("Natijalar:", {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([...masters]),
  });
}
