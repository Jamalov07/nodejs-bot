import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
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

@Table({ tableName: "order" })
export class Order extends Model<Order, OrderAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING })
  user_id: string;
  @BelongsTo(() => User)
  user:User;
  @ForeignKey(() => Master)
  @Column({ type: DataType.STRING })
  master_id: string;
  @BelongsTo(() => Master)
  master:Master;
  @ForeignKey(() => Service_type)
  @Column({ type: DataType.INTEGER })
  service_id: number;
  @BelongsTo(() => Service_type)
  serviceType:Service_type;
  @Column({ type: DataType.STRING })
  date: string;
  @Column({ type: DataType.STRING })
  time: string;
}
