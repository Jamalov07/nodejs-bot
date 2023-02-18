import { Column, DataType, Model, Table } from "sequelize-typescript";

interface Service_typeAttr {
  name: string;
}
@Table({ tableName: "service_type" })
export class Service_type extends Model<Service_type, Service_typeAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  name: string;
}
