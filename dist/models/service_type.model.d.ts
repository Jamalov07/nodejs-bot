import { Model } from "sequelize-typescript";
interface Service_typeAttr {
    name: string;
}
export declare class Service_type extends Model<Service_type, Service_typeAttr> {
    id: number;
    name: string;
}
export {};
