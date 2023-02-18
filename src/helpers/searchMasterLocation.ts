import { Context, Markup } from "telegraf";

export async function search_mijoz_location(ctx: Context) {
  await ctx.reply("'Locatsiyani yuborish 📍' tugmasini bosing", {
    parse_mode: "HTML",
    ...Markup.keyboard([["Locatsiyani yuborish 📍"], ["orqaga ↩️"]]).resize(),
  });
}

export async function show_mijoz_locations(ctx, user, count) {
  const masters = [];
  const distances = JSON.parse(user.distance);

  const len =
    distances.length - 10 * (count + 1) > 10 * (count + 1)
      ? 10 * (count + 1)
      : distances.length;
  for (let i = 10 * count; i < len; i++) {
    masters.push([
      {
        text: `${distances[i].name}-${distances[i].distance} metr`,
        callback_data: `master-${distances[i].id}`,
      },
    ]);
  }
  if (count != 0 && distances.length - 10 * (count + 1) > 10 * (count + 1)) {
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
  } else if (distances.length == 10) {
    masters.push([
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersRating-${count + 1}`,
      },
    ]);
  } else if (distances.length < 10 && count != 0) {
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
