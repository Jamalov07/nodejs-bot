import { Column, DataType, Model, Table } from "sequelize-typescript";

interface RankingAttr {
  user_id: string;
  master_id: string;
  rank: number;
}

@Table({ tableName: "ranking", timestamps: false })
export class Ranking extends Model<Ranking, RankingAttr> {
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
  rank: number;
}
