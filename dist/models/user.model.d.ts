import { Model } from "sequelize-typescript";
interface UserAttr {
    user_id: string;
    phone_number: string;
    first_name: string;
    last_name: string;
    username: string;
    status: boolean;
    last_state: string;
    real_name: string;
    message_id: string;
}
export declare class User extends Model<User, UserAttr> {
    user_id: string;
    phone_number: string;
    first_name: string;
    real_name: string;
    last_name: string;
    username: string;
    last_state: string;
    status: boolean;
    message_id: string;
}
export {};
