import { Model } from "sequelize-typescript";
interface adminAttr {
    admin_id: string;
    last_state: string;
    target_user_id: string;
    search_master_state: number;
    target_service_type_id: number;
    message_id: string;
}
export declare class Admin extends Model<Admin, adminAttr> {
    admin_id: string;
    last_state: string;
    search_master_state: number;
    target_user_id: string;
    target_service_type_id: string;
    message_id: string;
}
export {};
