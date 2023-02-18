import { Context } from "telegraf";
import { AppService } from "./app.service";
export declare class AppUpdate {
    private readonly appService;
    constructor(appService: AppService);
    onStart(ctx: Context): Promise<void>;
    registrtion(ctx: Context): Promise<void>;
    hearsMaster(ctx: Context): Promise<void>;
    actionService(ctx: Context): Promise<void>;
    onContact(ctx: Context): Promise<void>;
    next(ctx: Context): Promise<void>;
    onLocation(ctx: Context): Promise<void>;
    confirm(ctx: Context): Promise<void>;
    cancelConfirm(ctx: Context): Promise<void>;
    allowThisMaster(ctx: Context): Promise<void>;
    noAllowThisMaster(ctx: Context): Promise<void>;
    blockThis(ctx: Context): Promise<void>;
    checkStatus(ctx: Context): Promise<void>;
    sendMessage(ctx: Context): Promise<void>;
    cancelRegistration(ctx: Context): Promise<void>;
    hearsClients(ctx: Context): Promise<void>;
    hearsRating(ctx: Context): Promise<void>;
    hearsTime(ctx: Context): Promise<void>;
    onSearch(ctx: Context): Promise<void>;
    onMessage(ctx: Context): Promise<void>;
}
