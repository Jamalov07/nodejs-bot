import { Context, Markup } from "telegraf";

export async function messageToAdmin(message:string,ctx:Context){
  await ctx.reply(
    `${message}`,
    {
      parse_mode:'HTML',
      ...Markup.keyboard([
        ["🧰 Xizmatlar","🧖‍♂️ Ustalar","🙍‍♂️ Mijozlar"]
      ])
        .oneTime()
        .resize()
    }
  )
}