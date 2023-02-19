import { Op } from "sequelize";
import { Context, Markup } from "telegraf";
import { addMinutes, parseTime } from "./adMinutes";

export async function get_times(ctx: Context, user, order, master) {
  const addMinute = master.time_per_work;
  let time = master.work_start_time;
  let times = [];
  while (true) {
    console.log(user.user_id, master.master_id, user.select_day, time);
    console.log(
      await order.findOne({
        where: {
          [Op.and]: [
            { user_id: user.user_id },
            { master_id: master.master_id },
            { date: user.select_day },
            { time },
          ],
        },
      })
    );
    let check = !(await order.findOne({
      where: {
        user_id: user.user_id,
        master_id: master.master_id,
        date: user.select_day,
        time,
      },
    }));
    check = !(await order.findOne({
      where: {
        user_id: user.user_id,
        date: user.select_day,
        time,
      },
    }));
    times.push({
      time,
      empty: check,
    });
    time = await addMinutes(time, addMinute);

    const hhmm1 = await parseTime(time);
    const hhmm2 = await parseTime(master.work_end_time);
    var date1 = new Date(2000, 0, 1, hhmm1.hh, hhmm1.mm); // 9:00 AM
    var date2 = new Date(2000, 0, 1, hhmm2.hh, hhmm2.mm); // 9:00 AM
    if (date2 < date1) {
      break;
    }
  }

  user.distance = JSON.stringify(times);
  await user.save();

  // return await ctx.reply("Kunlarni tanlang", {
  //   parse_mode: "HTML",
  //   ...Markup.inlineKeyboard([]),
  // });
}
