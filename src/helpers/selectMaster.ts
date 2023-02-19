import { Context, Markup } from "telegraf";

export async function select_master(ctx: Context, master) {
  const str = `👱‍♂️ ISMI – ${master.name || "❌❌❌"}
📞 TELEFON RAQAMI – ${master.phone_number || "❌❌❌"}
⭐️ REYTINGI – ${master.rating || "❌❌❌"}${"⭐️".repeat(
    Math.round(master.rating)
  )}
🏢 USTAXONA NOMI – ${master.service_name || "❌❌❌"}
🏞 MANZILI – ${master.address || "❌❌❌"}
🎯 MO’LJAL – ${master.target_address || "❌❌❌"}`;
  return await ctx.reply(str, {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([
      [
        {
          text: "📍 LOKATSIYASI",
          callback_data: `masterLocation-${master.location}`,
        },

        {
          text: "⭐️ BAHOLASH",
          callback_data: `Ranking`,
        },
      ],
      [
        {
          text: "🕔 VAQT OLISH",
          callback_data: `getTimeOrder`,
        },

        {
          text: "orqaga ↩️",
          callback_data: `goBack`,
        },
      ],
    ]),
  });
}
