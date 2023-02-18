import { Context } from "telegraf";
import { AppService } from "./app.service";
export declare class AppUpdate {
    private readonly appService;
    constructor(appService: AppService);
    onStart(ctx: Context): Promise<void>;
    registrtion(ctx: Context): Promise<void>;
    hearsMaster(ctx: Context): Promise<void>;
    hearsServiceName(ctx: Context): Promise<void>;
}
