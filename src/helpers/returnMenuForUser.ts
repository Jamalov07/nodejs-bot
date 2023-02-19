import { Context, Markup } from "telegraf";

export async function returnMenuForUser(ctx:Context,message:string) {
    await ctx.reply(`${message}`, {
        parse_mode:"HTML",
        ...Markup.keyboard(["🏠 Bosh menyu","🙍‍♂️ Mijozlarni izlashda davom etish","✔️ Userni bandan yechish"])
        .oneTime()
        .resize()
    })
}