import { Context, Telegraf } from "telegraf";
import { User } from "./models/user.model";
import { Service_type } from "./models/service_type.model";
import { Master } from "./models/master.model";
import { Order } from "./models/order.model";
import { Admin } from "./models/admin.model";
export declare class AdminService {
    private userRepository;
    private serviceRepository;
    private masterRepository;
    private orderRepository;
    private adminRepository;
    private readonly bot;
    constructor(userRepository: typeof User, serviceRepository: typeof Service_type, masterRepository: typeof Master, orderRepository: typeof Order, adminRepository: typeof Admin, bot: Telegraf<Context>);
    commandAdmin(ctx: Context): Promise<void>;
    showProperties(ctx: Context): Promise<void>;
    addServiceType(ctx: Context): Promise<void>;
    onMessage(ctx: Context): Promise<void>;
    toMainMenu(ctx: Context): Promise<void>;
    reAddNewItem(ctx: Context): Promise<void>;
    hearsServiceFields(ctx: Context): Promise<void>;
    searchByName(ctx: Context): Promise<void>;
    searchByNumber(ctx: Context): Promise<void>;
    complectMasters(ctx: Context): Promise<void>;
    deleteMaster(ctx: Context): Promise<void>;
    deActiveMaster(ctx: Context): Promise<void>;
    sendMessage(ctx: Context): Promise<void>;
    showStatics(ctx: Context): Promise<void>;
    changeFields(ctx: Context): Promise<void>;
    deleteFields(ctx: Context): Promise<void>;
    removeFields(ctx: Context): Promise<void>;
    updateFields(ctx: Context): Promise<void>;
    seeUsers(ctx: Context): Promise<void>;
    searchUserByPhone(ctx: Context): Promise<void>;
    searchUserByName(ctx: Context): Promise<void>;
    sendMessageAll(ctx: Context): Promise<void>;
    sendMessageUser(ctx: Context): Promise<void>;
    seeAllServiceTypes(ctx: Context): Promise<void>;
    doBan(ctx: Context): Promise<void>;
    deBan(ctx: Context): Promise<void>;
    isBan(ctx: Context): Promise<void>;
    userStat(ctx: Context): Promise<void>;
    msgToUser(ctx: Context): Promise<void>;
    nextElement(ctx: Context): Promise<void>;
}
