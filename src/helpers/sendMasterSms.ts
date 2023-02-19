import { Context, Markup } from "telegraf";

export async function sendSMSMaster(ctx, user, order) {
  await ctx.telegram.sendMessage(
    +order.master_id,
    `${order.date}.${order.time}-vaqtni ${user.real_name} mijoz band qilmoqchi. Rozi bo'lasizmi?`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          {
            text: "Xa ✅",
            callback_data: `xa-${order.id}`,
          },
          {
            text: "Yo'q ❌",
            callback_data: `yo'q-${order.id}`,
          },
        ],
      ]),
    }
  );

  await ctx.reply(
    "So'rov muvaffaqiyatli yuborildi. Birozdan keyin javobini olishingiz mumkin"
  );
}
