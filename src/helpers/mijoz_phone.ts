import { Context, Markup } from "telegraf";

export async function mijoz_phone(ctx: Context) {
  await ctx.reply("'Telefon raqam yuborish 📞' tugmasini bosing", {
    parse_mode: "HTML",
    ...Markup.keyboard([
      [Markup.button.contactRequest("Telefon raqam yuborish 📞")],
    ]).resize(),
  });
}
export async function change_mijoz_phone(ctx: Context) {
  await ctx.reply("'Telefon raqam yuborish 📞' tugmasini bosing", {
    parse_mode: "HTML",
    ...Markup.keyboard([
      [Markup.button.contactRequest("Telefon raqam yuborish 📞")],
      ["orqaga ↩️"],
    ]).resize(),
  });
}
