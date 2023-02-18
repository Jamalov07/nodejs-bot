"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageMasterMenu = void 0;
const telegraf_1 = require("telegraf");
async function messageMasterMenu(master_id, message, ctx) {
    await ctx.reply(`${message}`, Object.assign({ parse_mode: 'HTML' }, telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback("❌ Ustani o'chirish", `delmaster=${master_id}`)],
        [telegraf_1.Markup.button.callback("✔️ Ustani aktiv emas qilib qo'yish", `deactivemas=${master_id}`)],
        [telegraf_1.Markup.button.callback("📊 Statistikani ko'rish", `showstats=${master_id}`)],
        [telegraf_1.Markup.button.callback("📝 Ustaga reklama yoki xabar yuborish", `sendmess=${master_id}`)],
        [telegraf_1.Markup.button.callback("🏠 Bosh menyu", 'mainmenu')]
    ])));
}
exports.messageMasterMenu = messageMasterMenu;
//# sourceMappingURL=messageMaster.menu.js.map