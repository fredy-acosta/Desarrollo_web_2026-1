import { Car } from '../models/CarI';
import { TuitionI } from '../models/TuitionI';
import { faker } from '@faker-js/faker';

async function createFakeData() {
    for (let i = 0; i < 20; i++) {
        await Car.create({
            marca: faker.vehicle.manufacturer(),
            clase: faker.vehicle.type(),
            modelo: faker.vehicle.model(),
            cilindraje: parseFloat(faker.number.float({ min: 1.0, max: 6.0 }).toFixed(1)),
            capacidad: faker.number.int({ min: 2, max: 8 }),
            status: 'ACTIVE',
        });
    }

    const cars = await Car.findAll({ where: { status: 'ACTIVE' } });

    for (let i = 0; i < 50; i++) {
        await TuitionI.create({
            date_matricula: faker.date.past(),
            ciudad: faker.location.city(),
            pago: parseFloat(faker.number.float({ min: 100000, max: 5000000 }).toFixed(2)),
            car_id: cars.length > 0
                ? cars[faker.number.int({ min: 0, max: cars.length - 1 })]?.id ?? null
                : null,
            status: 'ACTIVE',
        });
    }
}

createFakeData().then(() => {
    console.log('Datos falsos creados exitosamente');
}).catch((error) => {
    console.error('Error al crear datos falsos:', error);
});
