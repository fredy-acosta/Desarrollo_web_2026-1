import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";
import { TuitionI as TuitionModel } from "./TuitionI";

export interface CarI {
  id?: number;
  marca: string;
  clase: string;
  modelo: string;
  cilindraje: number;
  capacidad: number;
  status: "ACTIVE" | "INACTIVE";
}

export class Car extends Model {
  public id!: number;
  public marca!: string;
  public clase!: string;
  public modelo!: string;
  public cilindraje!: number;
  public capacidad!: number;
  public status!: "ACTIVE" | "INACTIVE";
}

Car.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    marca: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: { msg: "Marca is required" },
        notEmpty: { msg: "Marca cannot be empty" },
        len: {
          args: [1, 100],
          msg: "Marca must be between 1 and 100 characters",
        },
      },
    },
    clase: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: { msg: "Clase is required" },
        notEmpty: { msg: "Clase cannot be empty" },
        len: {
          args: [1, 100],
          msg: "Clase must be between 1 and 100 characters",
        },
      },
    },
    modelo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: { msg: "Modelo is required" },
        notEmpty: { msg: "Modelo cannot be empty" },
        len: {
          args: [1, 100],
          msg: "Modelo must be between 1 and 100 characters",
        },
      },
    },
    cilindraje: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: { msg: "Cilindraje is required" },
        isFloat: { msg: "Cilindraje must be a valid number" },
        min: {
          args: [0],
          msg: "Cilindraje must be greater than or equal to 0",
        },
      },
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Capacidad is required" },
        isInt: { msg: "Capacidad must be a valid integer" },
        min: {
          args: [1],
          msg: "Capacidad must be at least 1",
        },
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
    modelName: "Car",
    tableName: "cars",
    timestamps: false,
  }
);

Car.hasMany(TuitionModel, {
  foreignKey: "car_id",
  sourceKey: "id",
});

TuitionModel.belongsTo(Car, {
  foreignKey: "car_id",
  targetKey: "id",
});