/* jshint indent: 1 */

import { Table, Column, Model, DataType, PrimaryKey, Index} from "sequelize-typescript";

@Table({ tableName: "t_user_info", freezeTableName: true, timestamps: false, })
export default class tUserInfo extends Model<tUserInfo> {

  @PrimaryKey
  @Column({ type: DataType.STRING, field: "uid" })
  public uid: string

  @Column({ type: DataType.STRING, field: "password" })
  public password: string

  @Column({ type: DataType.TINYINT, field: "activated" })
  public activated: boolean 
 
  @Index({ name: "idx_create_time" })
  @Column({ type: DataType.DATE, field: "create_time" })
  public create_time: Date

  @Index({ name: "idx_update_time" })
  @Column({ type: DataType.DATE, field: "update_time" })
  public update_time: Date
 
}

