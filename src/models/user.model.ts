import { Column, DataType, Model, Table } from "sequelize-typescript";

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
  location: string;
  distance: string;
  paginationCount: number;
  service_id: number;
  searchName: string;
  searchType: string;
  selectMasterId: string;
  select_day: string;
}
@Table({ tableName: "user", timestamps: false })
export class User extends Model<User, UserAttr> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  user_id: string;

  @Column({
    type: DataType.STRING,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
  })
  first_name: string;
  @Column({
    type: DataType.STRING,
  })
  real_name: string;
  @Column({
    type: DataType.STRING,
  })
  last_name: string;
  @Column({
    type: DataType.STRING,
  })
  message_id: string;

  @Column({
    type: DataType.STRING,
  })
  username: string;
  @Column({
    type: DataType.STRING,
  })
  last_state: string;
  @Column({
    type: DataType.STRING,
  })
  location: string;
  @Column({
    type: DataType.INTEGER,
  })
  paginationCount: number;
  @Column({
    type: DataType.INTEGER,
  })
  service_id: number;
  @Column({
    type: DataType.STRING,
  })
  searchName: string;
  @Column({
    type: DataType.STRING,
  })
  searchType: string;
  @Column({
    type: DataType.STRING,
  })
  selectMasterId: string;
  @Column({
    type: DataType.STRING,
  })
  select_day: string;
  @Column({
    type: DataType.STRING(2000),
  })
  distance: string;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  status: boolean;
}
