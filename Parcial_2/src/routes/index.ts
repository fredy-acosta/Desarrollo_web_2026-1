import { CarRoutes } from "./car.routes";
import { TuitionRoutes } from "./tuition.routes";

export class Routes {
  public carRoutes: CarRoutes = new CarRoutes();
  public tuitionRoutes: TuitionRoutes = new TuitionRoutes();
}