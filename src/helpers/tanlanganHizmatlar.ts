import { Context, Markup } from "telegraf";

export async function tanlangan_hizmatlar(ctx: Context, order, master) {
  try {
    await ctx.reply(
      `${order.date} – ${order.time} / ${master?.service_name || ""}, ${
        master?.name || ""
      }`,
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [
            { text: "📍 Manzilni ko'rish", callback_data: "manzil" },
            { text: "❌ BEKOR QILISH ", callback_data: "manzil" },
          ],
          [{ text: "✍️ Xabar yuborish", callback_data: "manzil" }],
        ]),
      }
    );
  } catch (error) {
    console.log(error);
  }
}
