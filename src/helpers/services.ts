import { Context, Markup } from "telegraf";

export async function services_mijoz(ctx: Context, services) {
  try {
    ctx.reply("MAVJUD XIZMATLAR RO’YXATI", {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([...services]),
    });
  } catch (error) {
    console.log(error);
  }
}
