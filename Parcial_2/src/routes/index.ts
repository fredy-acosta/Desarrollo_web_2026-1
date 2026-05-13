import { Router } from "express";
import { CarRoutes } from "./car.routes";
import { TuitionRoutes } from "./tuition.routes";

export class Routes {
  // agrega tus rutas aquí de la siguiente manera
  public carRoutes: CarRoutes = new CarRoutes();
  public tuitionRoutes: TuitionRoutes = new TuitionRoutes();
}