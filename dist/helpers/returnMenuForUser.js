"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnMenuForUser = void 0;
const telegraf_1 = require("telegraf");
async function returnMenuForUser(ctx, message) {
    await ctx.reply(`${message}`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.keyboard(["🏠 Bosh menyu", "🙍‍♂️ Mijozlarni izlashda davom etish", "✔️ Userni bandan yechish"])
        .oneTime()
        .resize()));
}
exports.returnMenuForUser = returnMenuForUser;
//# sourceMappingURL=returnMenuForUser.js.map