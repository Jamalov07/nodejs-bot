import { Context, Markup } from "telegraf";

export async function boshMenu(ctx: Context) {
  await ctx.reply("Bosh sahifa", {
    parse_mode: "HTML",
    ...Markup.keyboard([["MIJOZ 👤"]]).resize(),
  });
}
