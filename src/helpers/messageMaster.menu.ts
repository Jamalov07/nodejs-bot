import { Context, Markup } from "telegraf";

export async function messageMasterMenu(master_id:string  ,message:string, ctx:Context) {
  await ctx.reply(`${message}`,
    {
      parse_mode:'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback("❌ Ustani o'chirish",`delmaster=${master_id}`)],
        [Markup.button.callback("✔️ Ustani aktiv emas qilib qo'yish",`deactivemas=${master_id}`)],
        [Markup.button.callback("📊 Statistikani ko'rish",`showstats=${master_id}`)],
        [Markup.button.callback("📝 Ustaga reklama yoki xabar yuborish",`sendmess=${master_id}`)],
        [Markup.button.callback("✍️ Hamma masterlarga xabar yuborish","sendAllSms")],
        [Markup.button.callback("🏠 Bosh menyu",'mainmenu')]
      ])
    }
  )
}