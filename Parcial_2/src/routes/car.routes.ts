import { Application } from "express";
import { CarController } from "../controllers/Car.controller";
 
export class CarRoutes {
  public controller = new CarController();
 
  public routes(app: Application): void {
    app.route("/api/car/public")
      .get(this.controller.getAllCars)
      .post(this.controller.createCar);
 
    app.route("/api/car/public/:id")
      .get(this.controller.getCarById)
      .patch(this.controller.updateCar)
      .delete(this.controller.deleteCar);
 
    app.route("/api/car/public/:id/logic")
      .delete(this.controller.deleteCarAdv);
  }
}

export class Routes {
    // agrega tus rutas aquí de la siguiente manera
    public modeloRoutes: ModeloRoutes = new ModeloRoutes();
}
