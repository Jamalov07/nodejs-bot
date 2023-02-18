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
    seeMasters(ctx: Context): Promise<void>;
    hearsServiceFields(ctx: Context): Promise<void>;
    searchByName(ctx: Context): Promise<void>;
    searchByNumber(ctx: Context): Promise<void>;
    complectMasters(ctx: Context): Promise<void>;
    deleteMaster(ctx: Context): Promise<void>;
    deActiveMaster(ctx: Context): Promise<void>;
    sendMessage(ctx: Context): Promise<void>;
}
