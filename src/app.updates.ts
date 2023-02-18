import { Action, Command, Ctx, On, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { AppService } from "./app.service";

@Update()
export class AppUpdate {
  constructor(private readonly appService: AppService) {}
}
