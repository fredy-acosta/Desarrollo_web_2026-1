"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../database/db");
const Tuitioni_1 = require("./Tuitioni");
class Car extends sequelize_1.Model {
}
exports.Car = Car;
Car.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    marca: {
        type: sequelize_1.DataTypes.STRING(100),
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
        type: sequelize_1.DataTypes.STRING(100),
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
        type: sequelize_1.DataTypes.STRING(100),
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
        type: sequelize_1.DataTypes.FLOAT,
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
        type: sequelize_1.DataTypes.INTEGER,
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
        type: sequelize_1.DataTypes.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
        validate: {
            isIn: {
                args: [["ACTIVE", "INACTIVE"]],
                msg: "Status must be ACTIVE or INACTIVE",
            },
        },
    },
}, {
    sequelize: db_1.sequelize,
    modelName: "Car",
    tableName: "cars",
    timestamps: false,
});
Car.hasMany(Tuitioni_1.TuitionI, {
    foreignKey: "car_id",
    sourceKey: "id",
});
Tuitioni_1.TuitionI.belongsTo(Car, {
    foreignKey: "car_id",
    targetKey: "id",
});
