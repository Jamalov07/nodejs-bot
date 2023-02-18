import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Service_type } from "./service_type.model";

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
  last_state:string;
  status: boolean;
  rating: number;
}
@Table({ tableName: "master" })
export class Master extends Model<Master, MasterAttr> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  master_id: string;
  @Column({ type: DataType.STRING })
  name: string;
  @Column({ type: DataType.STRING })
  phone_number: string;
  @ForeignKey(() => Service_type)
  @Column({ type: DataType.INTEGER })
  service_id: number;
  @BelongsTo(() => Service_type)
  serviceType:Service_type;
  @Column({ type: DataType.STRING })
  address: string;
  @Column({ type: DataType.STRING })
  location: string;
  @Column({ type: DataType.STRING })
  work_start_time: string;
  @Column({ type: DataType.STRING })
  work_end_time: string;
  @Column({ type: DataType.STRING })
  time_per_work: string;
  @Column({ type: DataType.STRING })
  user_name: string;
  @Column({ type: DataType.BOOLEAN })
  status: boolean;
  @Column({ type: DataType.INTEGER })
  rating: number;
  @Column({type:DataType.STRING})
  last_state:string;
  @Column({ type: DataType.STRING })
  price: string;
}
