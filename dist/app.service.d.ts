import { Context, Telegraf } from "telegraf";
import { User } from "./models/user.model";
import { Service_type } from "./models/service_type.model";
import { Master } from "./models/master.model";
import { Order } from "./models/order.model";
import { Admin } from "./models/admin.model";
export declare class AppService {
    private userRepository;
    private serviceRepository;
    private masterRepository;
    private orderRepository;
    private adminRepository;
    private readonly bot;
    constructor(userRepository: typeof User, serviceRepository: typeof Service_type, masterRepository: typeof Master, orderRepository: typeof Order, adminRepository: typeof Admin, bot: Telegraf<Context>);
}
