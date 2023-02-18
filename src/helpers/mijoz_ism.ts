import { Context, Markup } from "telegraf";

export async function mijoz_ism(ctx: Context) {
  await ctx.reply("Ismingizni kiriting", {
    parse_mode: "HTML",
    ...Markup.removeKeyboard(),
  });
}
export async function change_mijoz_ism(ctx: Context) {
  await ctx.reply("Ismingizni kiriting", {
    parse_mode: "HTML",
    ...Markup.keyboard([["orqaga ↩️"]]).resize(),
  });
}
export async function search_mijoz_ism(ctx: Context) {
  await ctx.reply("Qidirilayotgan ustaning ismini kiriting", {
    parse_mode: "HTML",
    ...Markup.keyboard([["orqaga ↩️"]]).resize(),
  });
}
