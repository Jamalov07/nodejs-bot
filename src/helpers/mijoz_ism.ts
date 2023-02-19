import { Context, Markup } from "telegraf";

export async function mijoz_ism(ctx: Context) {
  try {
    await ctx.reply("Ismingizni kiriting", {
      parse_mode: "HTML",
      ...Markup.removeKeyboard(),
    });
  } catch (error) {
    console.log(error);
  }
}
export async function change_mijoz_ism(ctx: Context) {
  try {
    await ctx.reply("Ismingizni kiriting", {
      parse_mode: "HTML",
      ...Markup.keyboard([["orqaga ↩️"]]).resize(),
    });
  } catch (error) {
    console.log(error);
  }
}
export async function search_mijoz_ism(ctx: Context) {
  try {
    await ctx.reply("Qidirilayotgan ustaning ismini kiriting", {
      parse_mode: "HTML",
      ...Markup.keyboard([["orqaga ↩️"]]).resize(),
    });
  } catch (error) {
    console.log(error);
  }
}
