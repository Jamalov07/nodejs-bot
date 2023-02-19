import { Context, Markup } from "telegraf";

export async function getSevenDeys(ctx: Context) {
  try {
    let days = [];
    let row = [];
    for (let i = 0; i < 7; i++) {
      let month =
        new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth();
      row.push({
        text: `${month}.${new Date().getDate() + i}`,
        callback_data: `day-${month}.${new Date().getDate() + i}`,
      });
      if (i === 2) {
        days.push(row);
        row = [];
      }
    }
    days.push(row);
    days.push([
      {
        text: "orqaga ↩️",
        callback_data: `goBack`,
      },
    ]);

    return await ctx.reply("Kunlarni tanlang", {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([...days]),
    });
  } catch (error) {
    console.log(error);
  }
}
