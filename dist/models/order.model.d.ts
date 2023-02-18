import { Model } from "sequelize-typescript";
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
    master_id: string;
    service_id: number;
    date: string;
    time: string;
}
export {};
