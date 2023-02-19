import { Context } from "telegraf";
import { AppService } from "./app.service";
import { AdminService } from "./admin.service";
export declare class AppUpdate {
    private readonly appService;
    private readonly adminService;
    constructor(appService: AppService, adminService: AdminService);
    enterToAdmin(ctx: Context): Promise<void>;
    properties(ctx: Context): Promise<void>;
    reTurn(ctx: Context): Promise<void>;
    addServiceType(ctx: Context): Promise<void>;
    seeAllServiceTypes(ctx: Context): Promise<void>;
    seeMasters(ctx: Context): Promise<void>;
    sendMessageUser(ctx: Context): Promise<void>;
    hearsService(ctx: Context): Promise<void>;
    sendSms(ctx: Context): Promise<void>;
    sendSmsAll(ctx: Context): Promise<void>;
    sendSmsUser(ctx: Context): Promise<void>;
    sendAllSms(ctx: Context): Promise<void>;
    toMainMenu(ctx: Context): Promise<void>;
    complectMasters(ctx: Context): Promise<void>;
    mMenu(ctx: Context): Promise<void>;
    ReturnToSearchUser(ctx: Context): Promise<void>;
    deleteMaster(ctx: Context): Promise<void>;
    deActiveMaster(ctx: Context): Promise<void>;
    showStats(ctx: Context): Promise<void>;
    sendMessageToMaster(ctx: Context): Promise<void>;
    deleteField(ctx: Context): Promise<void>;
    updateField(ctx: Context): Promise<void>;
    banUser(ctx: Context): Promise<void>;
    debanUser(ctx: Context): Promise<void>;
    isBanUser(ctx: Context): Promise<void>;
    statsUser(ctx: Context): Promise<void>;
    nextElement(ctx: Context): Promise<void>;
    messageToUser(ctx: Context): Promise<void>;
    buttonBan(ctx: Context): Promise<void>;
    reAddNewItem(ctx: Context): Promise<void>;
    buttonUnBan(ctx: Context): Promise<void>;
    reSeeMasters(ctx: Context): Promise<void>;
    searchByName(ctx: Context): Promise<void>;
    reAgainByNumber(ctx: Context): Promise<void>;
    changeFields(ctx: Context): Promise<void>;
    reChangeServiceType(ctx: Context): Promise<void>;
    reDeleteServiceType(ctx: Context): Promise<void>;
    deleteFields(ctx: Context): Promise<void>;
    searchByNumber(ctx: Context): Promise<void>;
    clients(ctx: Context): Promise<void>;
    returnToUserMenu(ctx: Context): Promise<void>;
    reSeeClients(ctx: Context): Promise<void>;
    retur(ctx: Context): Promise<void>;
    returnToSearch(ctx: Context): Promise<void>;
    searchUserByPhone(ctx: Context): Promise<void>;
    searchByUserByName(ctx: Context): Promise<void>;
    onMessage(ctx: Context): Promise<void>;
}
