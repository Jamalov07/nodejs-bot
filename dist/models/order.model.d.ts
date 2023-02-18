import { Model } from "sequelize-typescript";
import { User } from "./user.model";
import { Service_type } from "./service_type.model";
import { Master } from "./master.model";
interface OrderAttr {
    user_id: string;
    master_id: string;
    service_id: number;
    date: string;
    time: string;
}
export declare class Order extends Model<Order, OrderAttr> {
    id: number;
    user_id: string;
    user: User;
    master_id: string;
    master: Master;
    service_id: number;
    serviceType: Service_type;
    date: string;
    time: string;
}
export {};
