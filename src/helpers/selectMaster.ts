import { Context, Markup } from "telegraf";

export async function select_master(ctx: Context, master) {
  try {
    const str = `π±ββοΈ ISMI β ${master.name || "βββ"}
π TELEFON RAQAMI β ${master.phone_number || "βββ"}
β­οΈ REYTINGI β ${master.rating || "βββ"}${"β­οΈ".repeat(
      Math.round(master.rating)
    )}
π’ USTAXONA NOMI β ${master.service_name || "βββ"}
π MANZILI β ${master.address || "βββ"}
π― MOβLJAL β ${master.target_address || "βββ"}`;
    return await ctx.reply(str, {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          {
            text: "π LOKATSIYASI",
            callback_data: `masterLocation-${master.location}`,
          },

          {
            text: "β­οΈ BAHOLASH",
            callback_data: `Ranking`,
          },
        ],
        [
          {
            text: "π VAQT OLISH",
            callback_data: `getTimeOrder`,
          },

          {
            text: "orqaga β©οΈ",
            callback_data: `goBack`,
          },
        ],
      ]),
    });
  } catch (error) {
    console.log(error);
  }
}
