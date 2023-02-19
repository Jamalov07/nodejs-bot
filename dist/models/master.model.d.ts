import { Model } from "sequelize-typescript";
interface MasterAttr {
    master_id: string;
    name: string;
    phone_number: string;
    service_id: number;
    address: string;
    location: string;
    work_start_time: string;
    work_end_time: string;
    time_per_work: string;
    user_name: string;
    last_state: string;
    status: boolean;
    rating: number;
}
export declare class Master extends Model<Master, MasterAttr> {
    master_id: string;
    name: string;
    phone_number: string;
    service_id: number;
    address: string;
    location: string;
    work_start_time: string;
    work_end_time: string;
    time_per_work: string;
    user_name: string;
    status: boolean;
    rating: number;
    last_state: string;
    price: string;
}
export {};
