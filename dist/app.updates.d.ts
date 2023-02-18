import { Context } from "telegraf";
import { AppService } from "./app.service";
import { AdminService } from "./admin.service";
export declare class AppUpdate {
    private readonly appService;
    private readonly adminService;
    constructor(appService: AppService, adminService: AdminService);
    enterToAdmin(ctx: Context): Promise<void>;
    properties(ctx: Context): Promise<void>;
    addServiceType(ctx: Context): Promise<void>;
    toMainMenu(ctx: Context): Promise<void>;
    reAddNewItem(ctx: Context): Promise<void>;
    onMessage(ctx: Context): Promise<void>;
}
