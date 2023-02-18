"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchMasterNameFirst = exports.searchUserName = void 0;
const sequelize_1 = require("sequelize");
const telegraf_1 = require("telegraf");
async function searchUserName(ctx, user, masterRepo, count, searchName) {
    const results = await masterRepo.findAll({
        offset: 10 * count,
        limit: 10,
        where: {
            [sequelize_1.Op.and]: [
                { service_id: +user.last_state.split("-")[1] },
                { name: { [sequelize_1.Op.iLike]: `%${searchName}%` } },
            ],
        },
    });
    const masters = [];
    for (let i = 0; i < results.length; i++) {
        masters.push([
            {
                text: `${results[i].name + " " + "⭐️".repeat(Math.round(results[i].rating))}`,
                callback_data: `master-${results[i].master_id}`,
            },
        ]);
    }
    if (count != 0 && results.length == 10) {
        masters.push([
            {
                text: "⏪ Orqaga",
                callback_data: `prevMastersName-${count - 1}-${searchName}`,
            },
            {
                text: "keyingisi ⏩",
                callback_data: `prevMastersName-${count + 1}-${searchName}`,
            },
        ]);
    }
    else if (results.length == 10) {
        masters.push([
            {
                text: "keyingisi ⏩",
                callback_data: `prevMastersName-${count + 1}-${searchName}`,
            },
        ]);
    }
    else if (results.length < 10) {
        masters.push([
            {
                text: "⏪ Orqaga",
                callback_data: `prevMastersName-${count - 1}-${searchName}`,
            },
        ]);
    }
    await ctx.telegram.editMessageText(+user.user_id, +user.message_id, null, "Natijalar: ", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([...masters])));
}
exports.searchUserName = searchUserName;
async function searchMasterNameFirst(ctx, user, masterRepo, count, searchName) {
    const results = await masterRepo.findAll({
        offset: 10 * count,
        limit: 10,
        where: {
            [sequelize_1.Op.and]: [
                { service_id: +user.last_state.split("-")[1] },
                { name: { [sequelize_1.Op.iLike]: `%${searchName}%` } },
            ],
        },
    });
    const masters = [];
    console.log(results.length);
    if (!results.length) {
        return await ctx.reply("Hechkim topilmadi, Qaytadan urinib ko'ring");
    }
    user.message_id = String(ctx.message.message_id + 1);
    await user.save();
    for (let i = 0; i < results.length; i++) {
        masters.push([
            {
                text: `${results[i].name + " " + "⭐️".repeat(Math.round(results[i].rating))}`,
                callback_data: `master-${results[i].master_id}`,
            },
        ]);
    }
    if (count != 0 && results.length == 10) {
        masters.push([
            {
                text: "⏪ Orqaga",
                callback_data: `prevMastersName-${count - 1}-${searchName}`,
            },
            {
                text: "keyingisi ⏩",
                callback_data: `prevMastersName-${count + 1}-${searchName}`,
            },
        ]);
    }
    else if (results.length == 10) {
        masters.push([
            {
                text: "keyingisi ⏩",
                callback_data: `prevMastersName-${count + 1}-${searchName}`,
            },
        ]);
    }
    else if (results.length < 10 && count != 0) {
        masters.push([
            {
                text: "⏪ Orqaga",
                callback_data: `prevMastersName-${count - 1}-${searchName}`,
            },
        ]);
    }
    await ctx.reply("Natijalar:", Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([...masters])));
}
exports.searchMasterNameFirst = searchMasterNameFirst;
//# sourceMappingURL=searchUserName.js.map