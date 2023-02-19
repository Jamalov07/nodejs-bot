import { Context, Markup } from "telegraf";

export async function change_mijoz_data(ctx: Context) {
  try {
    ctx.reply("O'zgartirmoqchi bo'lgan ma'lumotingizni tanlang", {
      parse_mode: "HTML",
      ...Markup.keyboard([
        ["Ism, Familiya ✏️"],
        ["Telefon raqam 📞"],
        ["orqaga ↩️"],
      ]).resize(),
    });
  } catch (error) {
    console.log(error);
  }
}
export async function select_service_data(ctx: Context) {
  try {
    await ctx.reply(`Quyidagi kriteriyalar bo'yicha tanlang: `, {
      parse_mode: "HTML",
      ...Markup.keyboard([
        ["ISMI 📝"],
        ["REYTING ⭐️"],
        ["Lokatsiya 📍"],
        ["orqaga ↩️"],
      ]).resize(),
    });
  } catch (error) {
    console.log(error);
  }
}
