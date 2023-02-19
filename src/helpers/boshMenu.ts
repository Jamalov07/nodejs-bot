import { Context, Markup } from "telegraf";

export async function boshMenu(ctx: Context) {
  try {
    await ctx.reply("Bosh sahifa", {
      parse_mode: "HTML",
      ...Markup.keyboard([["👨‍🚀 Usta", "🤵‍♂️ Mijoz"]]).resize(),
    });
  } catch (error) {
    console.log(error);
  }
}
