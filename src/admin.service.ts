import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { InjectBot } from "nestjs-telegraf";
import { Context, Markup, Telegraf } from "telegraf";
import { MyBotName } from "./app.constants";
import { User } from "./models/user.model";
import { Service_type } from "./models/service_type.model";
import { Master } from "./models/master.model";
import { Order } from "./models/order.model";
import { Admin } from "./models/admin.model";
import { messageToAdmin } from "./helpers/messageToAdmin";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Service_type) private serviceRepository: typeof Service_type,
    @InjectModel(Master) private masterRepository: typeof Master,
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectModel(Admin) private adminRepository:typeof Admin,
    @InjectBot(MyBotName) private readonly bot: Telegraf<Context>
  ) {
  }

  async commandAdmin(ctx: Context) {
    const admin = await this.adminRepository.findOne({
      where:{
        admin_id:String(ctx.from.id)
      }
    })
    if(admin || ctx.from.id === Number(process.env.ADMIN_ID)){
      await this.bot.telegram.sendChatAction(ctx.from.id, "typing");
      await messageToAdmin('Assalomu alaykum! Xush kelibsiz hurmatli admin',ctx);
    } else {
      await ctx.replyWithHTML('🚫 Siz admin emassiz <b>"/start"</b> tugmasi orqali odatiy menuga qaytib botdan foydalinishingiz mumkin')
    }
  }

  async showProperties(ctx:Context) {
    await ctx.reply(
      "Xizmatlarda qilishingiz mumkin bo'lgan imkoniyatlar",
      {
        parse_mode:"HTML",
        ...Markup.keyboard([
          ["⏬ Xizmat qo'shish","🛂 Tahrirlash","🗑 O'chirib tashlash"]
        ])
          .oneTime()
          .resize()
      }
    )
  }

  async addServiceType(ctx:Context) {
    const admin = await this.adminRepository.findOne({
      where:{
        admin_id:String(ctx.from.id)
      }
    });
    if(!admin) {
      await this.adminRepository.create({
        admin_id: '' + ctx.from.id,
        last_state: 'addnewService'
      })
    }
    admin.last_state = 'addnewService'
    await admin.save()
    await ctx.replyWithHTML('💁‍♂️ Marhamat yangi servisning nomini kiriting !')
  }

  async onMessage(ctx:Context) {
    const admin = await this.adminRepository.findOne({
      where:{
        admin_id:String(ctx.from.id)
      }
    })
    if(admin.last_state == 'addnewService') {
      if('text' in ctx.message) {
        await this.serviceRepository.create({
          name:String(ctx.message.text)
        })
        admin.last_state = "finish";
        await admin.save()
        await ctx.reply('Muvaffaqiyatli qoshildi !',{
          parse_mode:'HTML',
          ...Markup.keyboard([
            ["♻️ Yana qo'shish","🏠 Bosh menyu"]

          ])
            .oneTime()
            .resize()
        })
      } else {
        await messageToAdmin('Bosh menyu',ctx);
      }
    } else if(admin.last_state === 'searchbynamemaster'){
      if('text' in ctx.message) {
        const data = await this.masterRepository.findOne({
          where:{
            name: `${ctx.message.text}`,
            service_id:admin.search_master_state
          }
        })
        if(data) {
          await ctx.reply(`Ismi: ${data.name}\naddress:${data.address}\nrating:${data.rating}\ntelefon raqami:${data.phone_number}\nxizmat narxi:${data.price}`,
          {
            parse_mode:'HTML',
            ...Markup.inlineKeyboard([
              [Markup.button.callback("❌ Ustani o'chirish",`delmaster=${data.master_id}`)],
              [Markup.button.callback("✔️ Ustani aktiv emas qilib qo'yish",`deactivemas=${data.master_id}`)],
              [Markup.button.callback("📊 Statistikani ko'rish",`showstats=${data.master_id}`)]
            ])
          }
          )
          await Markup.keyboard(["🏠 Bosh menyu"])
            .oneTime()
            .resize()
        } else {
          admin.search_master_state = 0
          admin.last_state = 'finish'
          await admin.save()
          await ctx.replyWithHTML(`<b>Ushbu yo'nalishda bunday nomli user yo'q</b>`)
          await this.complectMasters(ctx);
        }
      }
    } else if(admin.last_state === 'searchbynumbermaster') {
      if('text' in ctx.message) {
        const data = await this.masterRepository.findOne({
          where:{
            phone_number: ctx.message.text,
            service_id:admin.search_master_state
          }
        })
        if(data) {
          await ctx.reply(`Ismi: ${data.name}\naddress:${data.address}\nrating:${data.rating}\ntelefon raqami:${data.phone_number}\nxizmat narxi:${data.price}`,
            {
              parse_mode:'HTML',
              ...Markup.inlineKeyboard([
                [Markup.button.callback("❌ Ustani o'chirish",`delmaster=${data.master_id}`)],
                [Markup.button.callback("✔️ Ustani aktiv emas qilib qo'yish",`deactivemas=${data.master_id}`)],
                [Markup.button.callback("📊 Statistikani ko'rish",`showstats=${data.master_id}`)]
              ])
            }
          )
          await Markup.keyboard(["🏠 Bosh menyu"])
            .oneTime()
            .resize()
        } else {
          admin.search_master_state = 0
          admin.last_state = 'finish'
          await admin.save()
          await ctx.replyWithHTML(`<b>Ushbu yo'nalishda bunday raqamli user yo'q</b>`)
          await this.complectMasters(ctx);
        }
      }
    }
  }

  async toMainMenu(ctx:Context) {
    await messageToAdmin('<b>Bosh menyu</b>',ctx);
  }

  async reAddNewItem(ctx:Context) {
    await this.adminRepository.update({
      last_state:'addnewService'
    },{
      where:{
        admin_id:String(ctx.from.id)
      }
    })
    await ctx.reply('💁‍♂️ Marhamat yana bir bor yangi servis xizmati nomini kiriting !')
  }

  async seeMasters(ctx: Context){
    await this.complectMasters(ctx);
  }

  async hearsServiceFields(ctx: Context) {
    const master = await this.masterRepository.findOne({
      where: { master_id: `${ctx.from.id}` },
    });
    if ("match" in ctx) {
      const admin = await this.adminRepository.findOne({
        where:{
          admin_id:`${ctx.from.id}`
        }
      })
      const id = ctx.match[0].slice(7);
      admin.search_master_state = +id;
      await admin.save()
      await ctx.reply('Ustani ism yoki telefon raqam bilan izlashingiz mumkin!',{
        parse_mode:'HTML',
        ...Markup.keyboard([["🔍 Ism bo'yicha izlash"],["📱 telefon raqami bo'yicha izlash"]])
          .oneTime()
          .resize()
      })
    }
    }

  async searchByName(ctx:Context) {
    await this.adminRepository.update({
      last_state:'searchbynamemaster'
    },{
      where:{
        admin_id:`${ctx.from.id}`
      }
    })
    await ctx.reply('💁‍♂️ Marhamat ismni kiriting')
  }
  async searchByNumber(ctx:Context) {
    await this.adminRepository.update({
      last_state:'searchbynumbermaster'
    },{
      where:{
        admin_id:`${ctx.from.id}`
      }
    })
    await ctx.reply('💁‍♂️ Marhamat telefon raqamini kiriting')
  }

  async complectMasters(ctx:Context){
    const services = await this.serviceRepository.findAll();
    let serviceNames = [];
    for (let i = 0; i < services.length; i++) {
      serviceNames.push([
        Markup.button.callback(
          services[i].name,
          `fields=${services[i].id}`
        ),
      ]);
    }
    serviceNames.push([Markup.button.callback('🏠 Bosh menyu','mainmenu')])
    await ctx.reply("Ustalarning yo'nalishlaridan birini tanlang", {
      ...Markup.inlineKeyboard([...serviceNames]),
    });
  }
}


