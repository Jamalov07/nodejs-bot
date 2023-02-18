import { Context, Markup } from "telegraf";

export async function mainMijoz(ctx: Context) {
  await ctx.reply("Bosh sahifa", {
    parse_mode: "HTML",
    ...Markup.keyboard([
      ["XIZMATLAR 📂"],
      ["TANLANGAN XIZMATLAR 📥"],
      ["MA’LUMOTLARNI O’ZGARTIRISH 📝"],
    ]).resize(),
  });
}
