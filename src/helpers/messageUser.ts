import { Context, Markup } from "telegraf";

export async function messageUser(message:string,ctx:Context,id:string) {
  await ctx.reply(`${message}`,{
    parse_mode:"HTML",
    ...Markup.inlineKeyboard([
      [Markup.button.callback(`❌ Userni o'chirish`,`deluser=${id}`)],
      [Markup.button.callback('⛔️ Userni ban qilish',`banuser=${id}`)],
      [Markup.button.callback('📊 Statistika',`userstat=${id}`)],
      [Markup.button.callback('🏠 Bosh menu','mainmenu')]
    ])
  })
}