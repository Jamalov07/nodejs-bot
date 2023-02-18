import { Context, Markup } from "telegraf";

export async function services_mijoz(ctx: Context, services) {
  ctx.reply("MAVJUD XIZMATLAR RO’YXATI", {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([...services]),
  });
}
