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
}
