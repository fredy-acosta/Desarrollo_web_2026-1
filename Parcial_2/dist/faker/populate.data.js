"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const CarI_1 = require("../models/CarI");
const TuitionI_1 = require("../models/TuitionI");
const faker_1 = require("@faker-js/faker");
function createFakeData() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // Crear autos falsos
        for (let i = 0; i < 20; i++) {
            yield CarI_1.Car.create({
                marca: faker_1.faker.vehicle.manufacturer(),
                clase: faker_1.faker.vehicle.type(),
                modelo: faker_1.faker.vehicle.model(),
                cilindraje: parseFloat(faker_1.faker.number.float({ min: 1.0, max: 6.0 }).toFixed(1)),
                capacidad: faker_1.faker.number.int({ min: 2, max: 8 }),
                status: 'ACTIVE',
            });
        }
        // Crear matrículas falsas asociadas a los autos creados
        const cars = yield CarI_1.Car.findAll({ where: { status: 'ACTIVE' } });
        for (let i = 0; i < 50; i++) {
            yield TuitionI_1.TuitionI.create({
                date_matricula: faker_1.faker.date.past(),
                ciudad: faker_1.faker.location.city(),
                pago: parseFloat(faker_1.faker.number.float({ min: 100000, max: 5000000 }).toFixed(2)),
                car_id: cars.length > 0
                    ? (_b = (_a = cars[faker_1.faker.number.int({ min: 0, max: cars.length - 1 })]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null
                    : null,
                status: 'ACTIVE',
            });
        }
    });
}
createFakeData().then(() => {
    console.log('Datos falsos creados exitosamente');
}).catch((error) => {
    console.error('Error al crear datos falsos:', error);
});
