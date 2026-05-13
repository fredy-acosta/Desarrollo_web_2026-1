import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export interface TuitionI {
  id?: number;
  date_matricula: Date;
  ciudad: string;
  pago: number;
  car_id: number;
  status: "ACTIVE" | "INACTIVE";
}

export class TuitionI extends Model {
  public id?: number;
  public date_matricula!: Date;
  public ciudad!: string;
  public pago!: number;
  public car_id!: number;
  public status!: "ACTIVE" | "INACTIVE";
}

TuitionI.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date_matricula: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: { msg: "Date matricula is required" },
        isDate: { msg: "Date matricula must be a valid date" },
      },
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: { msg: "Ciudad is required" },
        notEmpty: { msg: "Ciudad cannot be empty" },
        len: {
          args: [1, 100],
          msg: "Ciudad must be between 1 and 100 characters",
        },
      },
    },
    pago: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: "Pago is required" },
        isDecimal: { msg: "Pago must be a valid decimal number" },
        min: {
          args: [0],
          msg: "Pago must be greater than or equal to 0",
        },
      },
    },
    car_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cars",
        key: "id",
      },
      validate: {
        notNull: { msg: "Car ID is required" },
        isInt: { msg: "Car ID must be a valid integer" },
      },
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
      validate: {
        isIn: {
          args: [["ACTIVE", "INACTIVE"]],
          msg: "Status must be ACTIVE or INACTIVE",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Tuition",
    tableName: "tuitions",
    timestamps: false,
  }
);