/* jshint indent: 1 */

import { Table, Column, Model, DataType, PrimaryKey, Unique, Index} from "sequelize-typescript";

@Table({ tableName: "t_user_info", freezeTableName: true, timestamps: false, })
// export default class tUserInfo extends Model<tUserInfo> {
export default class tUserInfo extends Model {

  @PrimaryKey
  @Column({ type: DataType.STRING, field: "f_uid" })
  public uid!: string

  @Column({ type: DataType.STRING, field: "f_password" })
  public password!: string

  @Index({ name: "idx_create_time" })
  @Column({ type: DataType.DATE, field: "f_create_time" })
  public create_time!: Date

  @Index({ name: "idx_update_time" })
  @Column({ type: DataType.DATE, field: "f_update_time" })
  public update_time!: Date
 
}

