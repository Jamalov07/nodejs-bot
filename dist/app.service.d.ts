import { Context, Telegraf } from "telegraf";
import { User } from "./models/user.model";
import { Service_type } from "./models/service_type.model";
import { Master } from "./models/master.model";
import { Order } from "./models/order.model";
export declare class AppService {
    private userRepository;
    private serviceRepository;
    private masterRepository;
    private orderRepository;
    private readonly bot;
    constructor(userRepository: typeof User, serviceRepository: typeof Service_type, masterRepository: typeof Master, orderRepository: typeof Order, bot: Telegraf<Context>);
    onStart(ctx: Context): Promise<void>;
    registration(ctx: Context): Promise<void>;
    hearsMaster(ctx: Context): Promise<void>;
    hearsServiceTypes(ctx: Context): Promise<void>;
    onMessage(ctx: Context): Promise<void>;
    onContact(ctx: Context): Promise<void>;
    hearsNext(ctx: Context): Promise<void>;
    onLocation(ctx: Context): Promise<void>;
    requestToAdmin(ctx: Context): Promise<void>;
    cancelRegistration(ctx: Context): Promise<void>;
    confirmInAdmin(ctx: Context): Promise<void>;
    checkStatusMaster(ctx: Context): Promise<void>;
    noAllow(ctx: Context): Promise<void>;
    toBlock(ctx: Context): Promise<void>;
    sendMessageToAdmin(ctx: Context): Promise<void>;
    hearsMijozlarInMaster(ctx: Context): Promise<void>;
}
