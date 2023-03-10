import { Context, Markup } from "telegraf";

export async function mijoz_phone(ctx: Context) {
  try {
    await ctx.reply("'Telefon raqam yuborish đ' tugmasini bosing", {
      parse_mode: "HTML",
      ...Markup.keyboard([
        [Markup.button.contactRequest("Telefon raqam yuborish đ")],
      ]).resize(),
    });
  } catch (error) {
    console.log(error);
  }
}
export async function change_mijoz_phone(ctx: Context) {
  try {
    await ctx.reply("'Telefon raqam yuborish đ' tugmasini bosing", {
      parse_mode: "HTML",
      ...Markup.keyboard([
        [Markup.button.contactRequest("Telefon raqam yuborish đ")],
        ["orqaga âŠī¸"],
      ]).resize(),
    });
  } catch (error) {
    console.log(error);
  }
}
