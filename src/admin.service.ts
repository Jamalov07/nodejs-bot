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
import { messageMasterMenu } from "./helpers/messageMaster.menu";

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
            service_id:admin.search_master_state,
            status:true
          }
        })
        if(data) {
          await this.adminRepository.update({
            last_state:'finish'
          },{
            where:{
              admin_id:`${ctx.from.id}`
            }
          })
          await ctx.reply(`Ismi: <b>${data.name}</b>\naddress:<b>${data.address}</b>\nrating:<b>${data.rating}</b>\ntelefon raqami:<b>${data.phone_number}</b>\nxizmat narxi:<b>${data.price}</b>`,
          {
            parse_mode:'HTML',
            ...Markup.inlineKeyboard([
              [Markup.button.callback("❌ Ustani o'chirish",`delmaster=${data.master_id}`)],
              [Markup.button.callback("✔️ Ustani aktiv emas qilib qo'yish",`deactivemas=${data.master_id}`)],
              [Markup.button.callback("📊 Statistikani ko'rish",`showstats=${data.master_id}`)],
              [Markup.button.callback("📝 Ustaga reklama yoki xabar yuborish",`sendmess=${data.master_id}`)],
              [Markup.button.callback("🏠 Bosh menyu",'mainmenu')]
            ])
          }
          )

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
            service_id:admin.search_master_state,
            status:true
          }
        })
        if(data) {
          await ctx.reply(`Ismi: <b>${data.name}</b>\naddress:<b>${data.address}</b>\nrating:<b>${data.rating}</b>\ntelefon raqami:<b>${data.phone_number}</b>\nxizmat narxi:<b>${data.price}</b>`,
            {
              parse_mode:'HTML',
              ...Markup.inlineKeyboard([
                [Markup.button.callback("❌ Ustani o'chirish",`delmaster=${data.master_id}`)],
                [Markup.button.callback("✔️ Ustani aktiv emas qilib qo'yish",`deactivemas=${data.master_id}`)],
                [Markup.button.callback("📊 Statistikani ko'rish",`showstats=${data.master_id}`)],
                [Markup.button.callback("📝 Ustaga reklama yoki xabar yuborish",`sendmess=${data.master_id}`)],
                [Markup.button.callback("🏠 Bosh menyu",'mainmenu')]
              ])
            }
          )
        } else {
          admin.search_master_state = 0
          admin.last_state = 'finish'
          await admin.save()
          await ctx.replyWithHTML(`<b>Ushbu yo'nalishda bunday raqamli user yo'q</b>`)
          await messageMasterMenu(data.master_id,'Yonalishlardan birini tanlashingiz mumkin',ctx);
        }
      }
    } else if(admin.last_state == 'sendMessage') {
      if('text' in ctx.message) {
        await ctx.telegram.sendMessage(admin.target_user_id,`<b>Xurmatli mutahassis! Sizga admin tomonidan xabar yuborildi</b>:\n${ctx.message.text}`,{
          parse_mode:'HTML'
        });
        await ctx.reply('✍️ Ustaga xabaringiz yuborildi')
        await this.complectMasters(ctx);
      }
    } else if(admin.last_state == "updatefield") {
      if('text' in ctx.message) {
        await this.serviceRepository.update({
          name: String(ctx.message.text)
        },{
          where:{
            id: admin.target_service_type_id
          }
        })
        admin.last_state = 'finish'
        await admin.save()
        await ctx.reply('Muvvafiqatli ozgartirildi !\n Davom etish uchun quyidagi buttonlardan birini tanlang',{
          parse_mode:'HTML',
          ...Markup.keyboard(["🔄 Yana boshqa service typeni o'zgartirish","🏠 Bosh menyu"])
            .oneTime()
            .resize()
        })
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
    await ctx.reply('💁‍♂️ Marhamat telefon raqamini kiriting\n Misol uchun : +998901234567')
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

  async deleteMaster(ctx:Context) {
    if ("match" in ctx) {
        const id = ctx.match[0].slice(10);
        console.log(id);
        await this.masterRepository.destroy({
          where:{
            master_id:id
          }
        })
      await ctx.reply(`Usta aktivi o'chirildi`,{
        parse_mode:"HTML",
        ...Markup.keyboard(["🏠 Bosh menyu","🛠 Yo'nalishlar ro'yxatiga qaytish"])
          .oneTime()
          .resize()
      })
    }
  }

  async deActiveMaster(ctx:Context) {
    if("match" in ctx) {
      const id = ctx.match[0].slice(12);
      await this.masterRepository.update({
        status:false
      },{
        where:{
          master_id:`${id}`
        }
      })
      await ctx.reply(`Usta aktivi o'chirildi`,{
        parse_mode:"HTML",
        ...Markup.keyboard(["🏠 Bosh menyu","🛠 Yo'nalishlar ro'yxatiga qaytish"])
          .oneTime()
          .resize()
      })
    }
  }

  async sendMessage(ctx:Context) {
    if("match" in ctx){
      const id = ctx.match[0].slice(9);
      await this.adminRepository.update({
        last_state:'sendMessage',
        target_user_id:id
      },{
        where:{
          admin_id:`${ctx.from.id}`
        }
      })
     await ctx.reply("💁‍♂️ Ustaga nima deb yozishni kiriting !")
    }
  }

  async showStatics(ctx:Context) {
    if("match" in ctx) {
      const id = ctx.match[0].slice(10);
      const order = await this.orderRepository.findAll({
        where:{
          master_id:id
        },include:{all:true}
      });
      const master = await this.masterRepository.findAll({
        where:{
          master_id:id
        },include:{all:true}
      })
      const myString = master[0].dataValues.price;
      const myNumber = parseFloat(myString.replace(/[^\d.]/g, ''));
      const countSum = myNumber * order.length;
      const countTax = ((countSum *30) / 100) * 5;
      await ctx.reply(`🔄 <b>Zakazlar soni</b> : ${order.length}\n💸 <b>narxi:</b>${master[0].dataValues.price}\n<b>🤑 Tahminan kunlik ishlaydigan summasi:</b>${countSum} ming so'm\n💰 <b>Ustadan necha pul soliq olish mumkin:</b>${countTax}ming so'm\n<b>💵 Tahminan oylik summasi</b>:${(countSum * 30) / 1000} million so'm`,{
        parse_mode:'HTML'
      })
      await messageMasterMenu(master[0].dataValues.master_id,'Yonalishlardan birini tanlashingiz mumkin',ctx);

    }
  }

  async changeFields(ctx:Context) {
    const services = await this.serviceRepository.findAll();
    let serviceNames = [];
    for (let i = 0; i < services.length; i++) {
      serviceNames.push([
        Markup.button.callback(
          services[i].name,
          `changefield=${services[i].id}`
        ),
      ]);
    }
    await ctx.reply("O'zgartirish uchun sohani tanlang", {
      ...Markup.inlineKeyboard([...serviceNames]),
    });
  }

  async deleteFields(ctx:Context) {
    const services = await this.serviceRepository.findAll();
    let serviceNames = [];
    for (let i = 0; i < services.length; i++) {
      serviceNames.push([
        Markup.button.callback(
          services[i].name,
          `deletefield=${services[i].id}`
        ),
      ]);
    }
    await ctx.reply("O'chirish uchun sohani tanlang", {
      ...Markup.inlineKeyboard([...serviceNames]),
    });
  }

  async removeFields(ctx:Context) {
    if("match" in ctx){
      const id = ctx.match[0].slice(12)
      await this.serviceRepository.destroy({
        where:{
          id:+id
        }
      })
      await ctx.reply(`Service turi o'chirildi`,{
        parse_mode:'HTML',
        ...Markup.keyboard(["🗑 Yana boshqa service turini o'chirib tashlash","🏠 Bosh menyu"])
          .oneTime()
          .resize()
      })
    }
  }

  async updateFields(ctx:Context) {
    if("match" in ctx) {
      const id = ctx.match[0].slice(12)
      console.log(id);
      await this.adminRepository.update({
        last_state:'updatefield',
        target_service_type_id:id
      },{
        where:{
          admin_id:ctx.from.id
        }
      })
      await ctx.reply('💁‍♂️ Marhamat, yangi nomni yozing')
    }
  }

  async seeUsers(ctx:Context) {
    await ctx.reply('Userlarni korish uchun, ism yoki telefon raqam bilan izlashingiz mumkin',{
      parse_mode:'HTML',
      ...Markup.keyboard(["📱 Telefon raqam orqali","🔎 Ism orqali izlash"])
        .oneTime()
        .resize()
    })
  }

  async searchUserByPhone(ctx:Context) {
    await this.adminRepository.update({
      last_state:'userbyphone',
    },{
      where:{
        admin_id:`${ctx.from.id}`
      }
    })
    await ctx.replyWithHTML('💁‍♂️ <b>Marhamat, userning telefon raqamini kiriting</b>')
  }

  async searchUserByName(ctx:Context) {
    await this.adminRepository.update({
      last_state:'userbyname',
    },{
      where:{
        admin_id:`${ctx.from.id}`
      }
    })
    await ctx.replyWithHTML('💁‍♂️ <b>Marhamat, userning ismini kiriting</b>')
  }
}


