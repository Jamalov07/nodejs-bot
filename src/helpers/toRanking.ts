import { Context, Markup } from "telegraf";

export async function ranking_master(ctx: Context, rank = null) {
  let str = "";
  if (rank) {
    str = `Siz oldin ${rank} baho qo'ygansiz,O'zgartirishingiz mumkin`;
  } else {
    str = "Quyidagi baholardan birini qo'ying:";
  }
  return await ctx.reply(str, {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([
      [
        {
          text: "1 ⭐️",
          callback_data: `getRank-1`,
        },

        {
          text: "2 ⭐️",
          callback_data: `getRank-2`,
        },
        {
          text: "3 ⭐️",
          callback_data: `getRank-3`,
        },
        {
          text: "4 ⭐️",
          callback_data: `getRank-4`,
        },
        {
          text: "5 ⭐️",
          callback_data: `getRank-5`,
        },
      ],
    ]),
  });
}
