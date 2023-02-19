import { Context, Markup } from "telegraf";

export async function tima_pagination(ctx, user) {
  const count = user.paginationCount;

  const masters = [];
  const times = JSON.parse(user.distance);
  const results = times.slice(12 * count, 12 * (count + 1));
  let summ = [];
  let sanoq = 0;
  for (const result of results) {
    sanoq++;
    summ.push({
      text: `${result.time}${result.empty ? "" : "❌"}`,
      callback_data: `timeSelect-${result.id}`,
    });
    if (sanoq == 4) {
      masters.push(summ);
      summ = [];
      sanoq = 0;
    }
  }
  masters.push(summ);

  if (count != 0 && results.length == 12) {
    masters.push([
      {
        text: "⏪ Orqaga",
        callback_data: `prevMastersTime-${count - 1}`,
      },
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersTime-${count + 1}`,
      },
    ]);
  } else if (results.length == 12) {
    masters.push([
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersTime-${count + 1}`,
      },
    ]);
  } else if (results.length < 12 && count != 0) {
    masters.push([
      {
        text: "⏪ Orqaga",
        callback_data: `prevMastersTime-${count - 1}`,
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
export async function tima_paginationsFirst(ctx, user) {
  const count = user.paginationCount;

  const masters = [];
  const times = JSON.parse(user.distance);
  const results = times.slice(12 * count, 12 * (count + 1));
  let summ = [];
  let sanoq = 0;
  for (const result of results) {
    sanoq++;
    summ.push({
      text: `${result.time}${result.empty ? "" : "❌"}`,
      callback_data: `timeSelect-${result.id}`,
    });
    if (sanoq == 4) {
      masters.push(summ);
      summ = [];
      sanoq = 0;
    }
  }
  masters.push(summ);

  if (count != 0 && results.length == 12) {
    masters.push([
      {
        text: "⏪ Orqaga",
        callback_data: `prevMastersTime-${count - 1}`,
      },
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersTime-${count + 1}`,
      },
    ]);
  } else if (results.length == 12) {
    masters.push([
      {
        text: "keyingisi ⏩",
        callback_data: `prevMastersTime-${count + 1}`,
      },
    ]);
  } else if (results.length < 12 && count != 0) {
    masters.push([
      {
        text: "⏪ Orqaga",
        callback_data: `prevMastersTime-${count - 1}`,
      },
    ]);
  }

  return await ctx.reply("Natijalar:", {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([...masters]),
  });
}
