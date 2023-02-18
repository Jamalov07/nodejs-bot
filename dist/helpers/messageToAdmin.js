"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageToAdmin = void 0;
const telegraf_1 = require("telegraf");
async function messageToAdmin(message, ctx) {
    await ctx.reply(`${message}`, Object.assign({ parse_mode: 'HTML' }, telegraf_1.Markup.keyboard([
        ["🧰 Xizmatlar", "🧖‍♂️ Ustalar", "🙍‍♂️ Mijozlar"]
    ])
        .oneTime()
        .resize()));
}
exports.messageToAdmin = messageToAdmin;
//# sourceMappingURL=messageToAdmin.js.map