import { Column, DataType, Model, Table } from "sequelize-typescript";

interface adminAttr {
  admin_id:string;
  last_state:string;
  target_user_id:string;
  search_master_state:number;
}

@Table({tableName:'admin'})
export class Admin extends Model<Admin,adminAttr> {
  @Column({
    type:DataType.STRING,
    unique:true,
    primaryKey:true,
    allowNull:false
  })
  admin_id:string;

  @Column({
    type:DataType.STRING,
  })
  last_state:string;

  @Column({
    type:DataType.INTEGER
  })
  search_master_state:number;

  @Column({
    type:DataType.STRING
  })
  target_user_id:string;
}