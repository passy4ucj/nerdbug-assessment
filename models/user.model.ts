import { Optional, UUIDV4 } from "sequelize";
import {
  Model,
  Table,
  Column,
  PrimaryKey,
  DataType,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  Unique,
  Default,
  IsUUID,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";

export enum UserRoleEnum {
    USER = "user",
    ADMIN = "admin" 
}

interface UserAttributes {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: UserRoleEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

@Table
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @IsUUID(4)
  @Default(UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column
  firstname!: string;

  @AllowNull(false)
  @Column
  lastname!: string;

  @AllowNull(false)
  @Column
  password!: string;

  @Unique
  @AllowNull(false)
  @Column
  email!: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRoleEnum)),
    allowNull: false,
    defaultValue: UserRoleEnum.USER,
  })
  role!: UserRoleEnum;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
