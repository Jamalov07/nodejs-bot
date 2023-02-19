import { Context, Markup } from "telegraf";

export async function getterServices(services,ctx:Context){
    let serviceNames = [];
    for (let i = 0; i < services.length; i++) {
      serviceNames.push([
        Markup.button.callback(
          services[i].name,
          `thisservice=${services[i].id}`
        ),
      ]);
    }
    await ctx.reply("Hozirda mavjud sohalar", {
        ...Markup.inlineKeyboard([...serviceNames]),
      });
}