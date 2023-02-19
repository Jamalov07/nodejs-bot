"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getterServices = void 0;
const telegraf_1 = require("telegraf");
async function getterServices(services, ctx) {
    let serviceNames = [];
    for (let i = 0; i < services.length; i++) {
        serviceNames.push([
            telegraf_1.Markup.button.callback(services[i].name, `thisservice=${services[i].id}`),
        ]);
    }
    await ctx.reply("Hozirda mavjud sohalar", Object.assign({}, telegraf_1.Markup.inlineKeyboard([...serviceNames])));
}
exports.getterServices = getterServices;
//# sourceMappingURL=getServices.js.map