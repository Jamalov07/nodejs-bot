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
import { messageUser } from "./helpers/messageUser";
import { Op } from "sequelize";
import { getterServices } from "./helpers/getServices";
import { returnMenuForUser } from "./helpers/returnMenuForUser";
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
    const services = await this.serviceRepository.findAll();
    let serviceNames = [];
    for (let i = 0; i < services.length; i++) {
      serviceNames.push([
        Markup.button.callback(
          services[i].name,
          `thisservice=${services[i].id}`
        ),
      ]);
    }
    await ctx.reply("Mavjud bo'lgan sohalar", {
      ...Markup.inlineKeyboard([...serviceNames]),
    });
    await ctx.reply(
      "Xizmatlarda qilishingiz mumkin bo'lgan imkoniyatlar",
      {
        parse_mode:"HTML",
        ...Markup.keyboard([
          ["⏬ Xizmat qo'shish","🛂 Tahrirlash","🗑 O'chirib tashlash","👀 Barcha xizmatlarni ko'rish"]
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
    const services = await this.serviceRepository.findAll()
    admin.last_state = 'addnewService'
    await getterServices(services,ctx);
    await admin.save()
    await ctx.replyWithHTML('💁‍♂️ <b>Marhamat yangi servisning nomini kiriting !</b>')
  }

  async onMessage(ctx:Context) {
    const admin = await this.adminRepository.findOne({
      where:{
        admin_id:String(ctx.from.id)
      }
    })
    if(admin.last_state == 'addnewService') {
      if('text' in ctx.message) {
        const check = await this.serviceRepository.findOne({
          where:{
            name:`${ctx.message.text}`
          }
        })
        const services = await this.serviceRepository.findAll()
        if(check){
          await getterServices(services,ctx);
          await ctx.reply('<b>Bunday nomli xizmat mavjud !</b>',{
            parse_mode:'HTML',
            ...Markup.keyboard([
              ["♻️ Yana qo'shish","🏠 Bosh menyu","🧰 Xizmatlar bo'limiga qaytish"]
  
            ])
              .oneTime()
              .resize()
          })
        } else {
          await this.serviceRepository.create({
            name:String(ctx.message.text)
          })
          const nServices = await this.serviceRepository.findAll()
          admin.last_state = "finish";
          await admin.save()
          await getterServices(nServices,ctx);
          await ctx.reply('<b>Muvaffaqiyatli qoshildi !</b>',{
            parse_mode:'HTML',
            ...Markup.keyboard([
              ["♻️ Yana qo'shish","🏠 Bosh menyu","🙍‍♂️ Mijozlar bo'limiga qaytish"]
  
            ])
              .oneTime()
              .resize()
          })
        } 
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
          await ctx.replyWithHTML(`<b>Ushbu yo'nalishda bunday nomli usta yo'q</b>`)
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
                [Markup.button.callback('✍️ Hammaga xabar yuborish','sendAllSms')],
                [Markup.button.callback("🏠 Bosh menyu",'mainmenu')]
              ])
            }
          )
        } else {
          admin.search_master_state = 0
          admin.last_state = 'finish'
          await admin.save()
          await ctx.reply(`<b>Ushbu yo'nalishda bunday raqamli usta yo'q</b>`,{
            parse_mode:'HTML',
            ...Markup.keyboard(["🏠 Bosh menyu","👨‍⚕️ Usta yo'nalishlariga qaytish","📱 Yana telefon raqami orqali izlash"])
            .oneTime()
            .resize()
          })
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
        const service = await this.serviceRepository.findAll()
        await getterServices(service,ctx);
        admin.last_state = 'finish';
        await admin.save()
        await ctx.reply('Muvvafiqatli ozgartirildi !\n Davom etish uchun quyidagi buttonlardan birini tanlang',{
          parse_mode:'HTML',
          ...Markup.keyboard(["🔄 Yana boshqa service typeni o'zgartirish","🏠 Bosh menyu"])
            .oneTime()
            .resize()
        })
      }
    } else if(admin.last_state == 'userbyname') {
        if('text' in ctx.message) {
          const oldUser = await this.userRepository.findAll({
            where:{
              real_name: {
                [Op.iLike]: `%${ctx.message.text}%`
              }
            },offset:0
          })
          const allUsers = await this.userRepository.findAll({
            where:{
              real_name: {
                [Op.iLike]: `%${ctx.message.text}%`
              }
            },
            limit:1,
            offset:0
          });
          console.log(oldUser.length)
          if(oldUser.length == 1){
            await ctx.reply(`Ismi:${allUsers[0].real_name}\nTelefon raqami:${allUsers[0].phone_number}`,{
              parse_mode:'HTML',
              ...Markup.inlineKeyboard([
                [Markup.button.callback("❌ Mijozni ban qilish",`banuser=${allUsers[0].user_id}`)],
                [Markup.button.callback("☑️ Mijozni ban dan yechish",`debanuser=${allUsers[0].user_id}`)],
                [Markup.button.callback("✔️ Mijozni ban yoki ban emasligini tekshirish",`isban=${allUsers[0].user_id}`)],
                [Markup.button.callback("📊 User haqida statistika chiqarish",`statuser=${allUsers[0].user_id}`)],
                [Markup.button.callback("✍️ Mijozga sms yuborish",`msguser=${allUsers[0].user_id}`)],
                [Markup.button.callback("🏠 User izlashga qaytish",'returntosearch')]
              ])
            });
          } else if(oldUser.length < 1) {
            await returnMenuForUser(ctx,'<b>Bunday nomli user yoq</b>');
          } else {
            const listIndicator = [];
            if(1 > 1){
              listIndicator.push(Markup.button.callback("⏮ Oldingi",`prev=${0}`))
            }
            if(0+1 < oldUser.length) {
              listIndicator.push(Markup.button.callback("⏭ Keyingisi",`next=${ctx.message.text}=${0+1}`))
            }
            await ctx.replyWithHTML(`<b>Bunday ismli user ko'p</b>`)
            await ctx.reply(`Ismi:${allUsers[0].real_name}\nTelefon raqami:${allUsers[0].phone_number}`,{
              parse_mode:'HTML',
              ...Markup.inlineKeyboard([
                [Markup.button.callback("❌ Mijozni ban qilish",`banuser=${allUsers[0].user_id}`)],
                [Markup.button.callback("☑️ Mijozni ban dan yechish",`debanuser=${allUsers[0].user_id}`)],
                [Markup.button.callback("✔️ Mijozni ban yoki ban emasligini tekshirish",`isban=${allUsers[0].user_id}`)],
                [Markup.button.callback("📊 User haqida statistika chiqarish",`statuser=${allUsers[0].user_id}`)],
                [Markup.button.callback("✍️ Mijozga sms yuborish",`msguser=${allUsers[0].user_id}`)],
                [Markup.button.callback("🏠 User izlashga qaytish",'returntosearch')],
                listIndicator
              ])
            });
          }
        }

    } else if(admin.last_state == 'sendAllMasters') {
        const masters = await this.masterRepository.findAll()
        await this.adminRepository.update({
          last_state:'finish'
        },{
          where:{
            admin_id:`${ctx.from.id}`
          }
        })
        if('text' in ctx.message) {
          for(let x of masters){
            await ctx.telegram.sendMessage(`${x.master_id}`,`<b>Xurmatli mutahassis! Admin tomonidan sizga xabar yuborildi</b>:\n ${ctx.message.text}`,{
              parse_mode:'HTML'
            })
          }
          await ctx.reply('Xabaringiz jonatildi',{
            parse_mode:'HTML',
            ...Markup.inlineKeyboard([
              [Markup.button.callback('🏠 Bosh menu','mainmenu')]
            ])
          })
        }
    } else if(admin.last_state == "sendsmstouser") {
      const users = await this.userRepository.findAll()
      await this.adminRepository.update({
        last_state:'finish'
      },{
        where:{
          admin_id:`${ctx.from.id}`
        }
      })
      if('text' in ctx.message) {
        for(let x of users){
          await ctx.telegram.sendMessage(`${x.user_id}`,`<b>Xurmatli foydalanuvchi! Admin tomonidan sizga xabar yuborildi</b>:\n ${ctx.message.text}`,{
            parse_mode:'HTML'
          })
        }
        await ctx.reply('Xabaringiz jonatildi',{
          parse_mode:'HTML',
          ...Markup.inlineKeyboard([
            [Markup.button.callback('🏠 Bosh menu','mainmenu')]
          ])
        })
      }
    } else if(admin.last_state == 'userbyphone') {
      if("text" in ctx.message) {
        const oneUser = await this.userRepository.findOne({
          where:{
            phone_number:`${ctx.message.text}`

          }
        })
        if(oneUser) {
          await ctx.reply(`<b>Ma'lumotlar</b>:\n<b>Userning ismi</b>:${oneUser.real_name}\n<b>Userning telefon raqami</b>:${oneUser.phone_number}\n`,{
            parse_mode:'HTML',
            ...Markup.inlineKeyboard([
              [Markup.button.callback("❌ Mijozni ban qilish",`banuser=${oneUser.user_id}`)],
              [Markup.button.callback("☑️ Mijozni ban dan yechish",`debanuser=${oneUser.user_id}`)],
              [Markup.button.callback("✔️ Mijozni ban yoki ban emasligini tekshirish",`isban=${oneUser.user_id}`)],
              [Markup.button.callback("📊 User haqida statistika chiqarish",`statuser=${oneUser.user_id}`)],
              [Markup.button.callback("✍️ Mijozga sms yuborish",`msguser=${oneUser.user_id}`)],
              [Markup.button.callback("🏠 User izlashga qaytish",'returntosearch')]
            ])
          })
        } else {
          await ctx.reply('Bunday raqamli user topilmadi',{
            parse_mode:"HTML",
            ...Markup.keyboard(["🏠 Bosh menyu","🙍‍♂️ Mijozlarni izlashda davom etish"])
            .oneTime()
            .resize()
          })
        }
      }
    } else if(admin.last_state == 'sendmsguser') {
        const admin = await this.adminRepository.findOne({
          where:{
            admin_id:`${ctx.from.id}`
          }
        });
        console.log(admin.target_user_id)
        if("text" in ctx.message) {
          await ctx.telegram.sendMessage(admin.target_user_id,ctx.message.text)
          await this.adminRepository.findOne({
            where:{
              last_state:'finish',
            }
          })
          await returnMenuForUser(ctx,'<b> Xabaringiz userga yuborildi! </b>');
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
    const services = await this.serviceRepository.findAll()
    await getterServices(services,ctx);
    await ctx.reply('💁‍♂️ Marhamat yana bir bor yangi servis xizmati nomini kiriting !')
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
        ...Markup.keyboard([["🔍 Ism bo'yicha izlash"],["📱 telefon raqami bo'yicha izlash","✍️ Hamma masterlarga xabar yuborish"]])
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
    serviceNames.push([Markup.button.callback('🏠 Bosh menyu','mainmenu')]);
    serviceNames.push([Markup.button.callback('✍️ Hamma userlarga xabar yuborish','sSmsAllUser')])
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
      const services = await this.serviceRepository.findAll()
      await getterServices(services,ctx);
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
      ...Markup.keyboard(["📱 Telefon raqam orqali","🔎 Ism orqali izlash","✍️ Hamma userlarga xabar yuborish","🏠 Bosh menyu"])
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
    await ctx.reply('💁‍♂️ <b>Marhamat, userning telefon raqamini kiriting</b>',{
      parse_mode:'HTML',
      ...Markup.keyboard(["🙍‍♂️ Mijozlarni bo'limiga qaytish","🏠 Bosh menyu"])
      .oneTime()
      .resize()
    })
  }

  async searchUserByName(ctx:Context) {
    await this.adminRepository.update({
      last_state:'userbyname',
    },{
      where:{
        admin_id:`${ctx.from.id}`
      }
    })
    await ctx.replyWithHTML('💁‍♂️ <b>Marhamat, userning ismini kiriting</b>',{
      parse_mode:'HTML',
      ...Markup.keyboard(["🙍‍♂️ Mijozlarni bo'limiga qaytish","🏠 Bosh menyu"])
      .oneTime()
      .resize()
    })
  }

  async sendMessageAll(ctx:Context) {
    await this.adminRepository.update({
      last_state:'sendAllMasters'
    },{
      where:{
        admin_id:`${ctx.from.id}`
      }
    })
    await ctx.reply('Marhamat xabarni kiriting')
  }

  async sendMessageUser(ctx:Context) {
    await this.adminRepository.update({
      last_state:'sendsmstouser'
    },{
      where:{
        admin_id:`${ctx.from.id}`
      }
    })
    await ctx.reply("Marhamat, xabarni kiriting!")
  }

  async seeAllServiceTypes(ctx:Context) {
    const services = await this.serviceRepository.findAll();
    let serviceNames = [];
    for (let i = 0; i < services.length; i++) {
      serviceNames.push([
        Markup.button.callback(
          services[i].name,
          `thisservice=${services[i].id}`
        ),
      ]);
    }
    serviceNames.push([Markup.button.callback("🏠 Bosh menyu","mainmenu")])
    await ctx.reply("Mavjud xizmatlar", {
      ...Markup.inlineKeyboard([...serviceNames]),
    });
  }

  async doBan(ctx: Context) {
    if("match" in ctx) {
      const id = ctx.match[0].slice(9);
      await this.userRepository.update({
        is_ban:true
      },{
        where:{
          user_id:id
        }
      })
      await returnMenuForUser(ctx,'User ban qilindi, Davom etish uchun quyidagilarni bosing')
    }
  }
  async deBan(ctx:Context) {
    if("match" in ctx) {
      const id = ctx.match[0].slice(11);
      await this.userRepository.update({
        is_ban:false
      },{
        where:{
          user_id:id
        }
      })
      await ctx.reply('User bandan yechildi, Davom etish uchun quyidagilardan birini tanlang',{
        parse_mode:'HTML',
        ...Markup.keyboard(["🏠 Bosh menyu","🙍‍♂️ Mijozlarni izlashda davom etish","✔️ Userni ban qilish"])
        .oneTime()
        .resize()
      })
    }
  }

  async isBan( ctx:Context) {
    if("match" in ctx) {
      const id = ctx.match[0].slice(6);
      console.log(id);
      const check = await this.userRepository.findOne({
        where:{
          user_id:`${id}`
        }
      })
      if(check.is_ban){
        await returnMenuForUser(ctx,'User ban da ekan, davom etish uchun quyidagilarni bosing')
      } else {
        await ctx.reply('User toliq ozodlikda !',{
          parse_mode:'HTML',
          ...Markup.keyboard(["🏠 Bosh menyu","🙍‍♂️ Mijozlarni izlashda davom etish","✔️ Userni ban qilish"])
          .oneTime()
          .resize()
        })
      }
    }
  }

  async userStat(ctx:Context){
    if("match" in ctx) {
      const id = ctx.match[0].slice(9);
      const order = await this.orderRepository.findAll({
        where:{
          user_id:id
        }
      })
      const user = await this.userRepository.findOne({
        where:{
          user_id:id
        }
      })
      await returnMenuForUser(ctx,`User ismi:${user.real_name}\nKunlik doktor ko'rigi:${order.length? order.length > 1: 2}\nOylik doktor ko'rigi:${order.length * 30 ? order.length > 1: 1 * 30}\nSalomatligi foizda:${100 - order.length}%`)
    }
  }

  async msgToUser(ctx:Context){
    if("match" in ctx) {
      const id = ctx.match[0].slice(8);
      await this.adminRepository.update({
        last_state:'sendmsguser',
        target_user_id:id
      },{
        where:{
          admin_id:`${ctx.from.id}`
        }
      })
      await returnMenuForUser(ctx,'👇 <b>Xabaringizni shu yerga yozing</b>')
    }
  }

  async nextElement(ctx:Context) {
    if("match" in ctx) {
      const msg = ctx.match["input"];
      const offset = +msg.split("=")[2];
      const name = msg.split("=")[1];
      const oldUser = await this.userRepository.findAll({
        where:{
          real_name: {
            [Op.iLike]: `%${name}%`
          },
        },offset:0
      });
      const allUsers = await this.userRepository.findAll({
        where:{
          real_name: {
            [Op.iLike]: `%${name}%`
          }
        },
        limit:1,
        offset:offset
      });
      console.log(oldUser.length)
      if(oldUser.length == 1){
        await ctx.reply(`Ismi:${allUsers[0].real_name}\nTelefon raqami:${allUsers[0].phone_number}`,{
          parse_mode:'HTML',
          ...Markup.inlineKeyboard([
            [Markup.button.callback("❌ Mijozni ban qilish",`banuser=${allUsers[0].user_id}`)],
            [Markup.button.callback("☑️ Mijozni ban dan yechish",`debanuser=${allUsers[0].user_id}`)],
            [Markup.button.callback("✔️ Mijozni ban yoki ban emasligini tekshirish",`isban=${allUsers[0].user_id}`)],
            [Markup.button.callback("📊 User haqida statistika chiqarish",`statuser=${allUsers[0].user_id}`)],
            [Markup.button.callback("✍️ Mijozga sms yuborish",`msguser=${allUsers[0].user_id}`)],
            [Markup.button.callback("🏠 User izlashga qaytish",'returntosearch')]
          ])
        });
      } else {
        const listIndicator = [];
        if(offset > 0){
          listIndicator.push(Markup.button.callback("⏮ Oldingi",`prev=${0}`))
        }
        if(offset+1 < oldUser.length) {
          listIndicator.push(Markup.button.callback("⏭ Keyingisi",`next=${0 + 1}`))
        }
        await ctx.reply(`Ismi:${allUsers[0].real_name}\nTelefon raqami:${allUsers[0].phone_number}`,{
          parse_mode:'HTML',
          ...Markup.inlineKeyboard([
            [Markup.button.callback("❌ Mijozni ban qilish",`banuser=${allUsers[0].user_id}`)],
            [Markup.button.callback("☑️ Mijozni ban dan yechish",`debanuser=${allUsers[0].user_id}`)],
            [Markup.button.callback("✔️ Mijozni ban yoki ban emasligini tekshirish",`isban=${allUsers[0].user_id}`)],
            [Markup.button.callback("📊 User haqida statistika chiqarish",`statuser=${allUsers[0].user_id}`)],
            [Markup.button.callback("✍️ Mijozga sms yuborish",`msguser=${allUsers[0].user_id}`)],
            [Markup.button.callback("🏠 User izlashga qaytish",'returntosearch')],
            listIndicator
          ])
        });
      }
      
    }
  }
}


