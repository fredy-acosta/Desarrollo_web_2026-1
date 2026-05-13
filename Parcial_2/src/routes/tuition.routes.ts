import { Application } from "express";
import { TuitionController } from "../controllers/ Tuition.controller";

export class TuitionRoutes {
  public controller = new TuitionController();

  public routes(app: Application): void {
    app.route("/api/tuition/public")
      .get(this.controller.getAllTuitions)
      .post(this.controller.createTuition);

    app.route("/api/tuition/public/:id")
      .get(this.controller.getTuitionById)
      .patch(this.controller.updateTuition)
      .delete(this.controller.deleteTuition);

    app.route("/api/tuition/public/:id/logic")
      .delete(this.controller.deleteTuitionAdv);
  }
}