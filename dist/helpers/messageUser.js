"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageUser = void 0;
const telegraf_1 = require("telegraf");
async function messageUser(message, ctx, id) {
    await ctx.reply(`${message}`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback(`❌ Userni o'chirish`, `deluser=${id}`)],
        [telegraf_1.Markup.button.callback('⛔️ Userni ban qilish', `banuser=${id}`)],
        [telegraf_1.Markup.button.callback('📊 Statistika', `userstat=${id}`)],
        [telegraf_1.Markup.button.callback('🏠 Bosh menu', 'mainmenu')]
    ])));
}
exports.messageUser = messageUser;
//# sourceMappingURL=messageUser.js.map