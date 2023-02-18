import { Column, DataType, Model, Table } from "sequelize-typescript";

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

  @Column({ type: DataType.STRING })
  user_id: string;
  @Column({ type: DataType.STRING })
  master_id: string;
  @Column({ type: DataType.INTEGER })
  service_id: number;
  @Column({ type: DataType.STRING })
  date: string;
  @Column({ type: DataType.STRING })
  time: string;
}
