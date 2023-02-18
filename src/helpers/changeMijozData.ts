import { Context, Markup } from "telegraf";

export async function change_mijoz_data(ctx: Context) {
  ctx.reply("O'zgartirmoqchi bo'lgan ma'lumotingizni tanlang", {
    parse_mode: "HTML",
    ...Markup.keyboard([
      ["Ism, Familiya ✏️"],
      ["Telefon raqam 📞"],
      ["orqaga ↩️"],
    ]).resize(),
  });
}
export async function select_service_data(ctx: Context) {
  await ctx.reply(`Quyidagi kriteriyalar bo'yicha tanlang: `, {
    parse_mode: "HTML",
    ...Markup.keyboard([
      ["ISMI 📝"],
      ["REYTING ⭐️"],
      ["Lokatsiya 📍"],
    ]).resize(),
  });
}
