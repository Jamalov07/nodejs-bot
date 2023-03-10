import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { TelegrafModule } from "nestjs-telegraf";
import { AdminService } from "./admin.service";
import { MyBotName } from "./app.constants";
import { AppService } from "./app.service";
import { AppUpdate } from "./app.updates";
import { Admin } from "./models/admin.model";
import { Master } from "./models/master.model";
import { Order } from "./models/order.model";
import { Ranking } from "./models/ranking.model";
import { Service_type } from "./models/service_type.model";
import { User } from "./models/user.model";

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: MyBotName,
      useFactory: () => ({
        token: process.env.BOT_TOKEN,
        middlewares: [],
        include: [],
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    SequelizeModule.forFeature([
      User,
      Order,
      Service_type,
      Master,
      Admin,
      Ranking,
    ]),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Order, Service_type, Master, Admin, Ranking],
      autoLoadModels: true,
      logging: false,
    }),
  ],

  providers: [AppService, AppUpdate, AdminService],
})
export class AppModule {}
