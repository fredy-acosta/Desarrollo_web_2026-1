"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const car_routes_1 = require("./car.routes");
const tuition_routes_1 = require("./tuition.routes");
class Routes {
    constructor() {
        this.carRoutes = new car_routes_1.CarRoutes();
        this.tuitionRoutes = new tuition_routes_1.TuitionRoutes();
    }
}
exports.Routes = Routes;
