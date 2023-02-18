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
    seeMasters(ctx: Context): Promise<void>;
    hearsService(ctx: Context): Promise<void>;
    toMainMenu(ctx: Context): Promise<void>;
    complectMasters(ctx: Context): Promise<void>;
    mMenu(ctx: Context): Promise<void>;
    deleteMaster(ctx: Context): Promise<void>;
    deActiveMaster(ctx: Context): Promise<void>;
    showStats(ctx: Context): Promise<AdminService>;
    sendMessageToMaster(ctx: Context): Promise<void>;
    reAddNewItem(ctx: Context): Promise<void>;
    searchByName(ctx: Context): Promise<void>;
    searchByNumber(ctx: Context): Promise<void>;
    onMessage(ctx: Context): Promise<void>;
}
