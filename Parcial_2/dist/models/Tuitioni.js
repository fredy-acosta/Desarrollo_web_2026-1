"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuitionI = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../database/db");
class TuitionI extends sequelize_1.Model {
}
exports.TuitionI = TuitionI;
TuitionI.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    date_matricula: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notNull: { msg: "Date matricula is required" },
            isDate: true,
        },
    },
    ciudad: {
        type: sequelize_1.DataTypes.STRING(100),
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
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
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
        type: sequelize_1.DataTypes.INTEGER,
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
    modelName: "Tuition",
    tableName: "tuitions",
    timestamps: false,
});
