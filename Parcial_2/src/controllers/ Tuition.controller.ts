import { Request, Response } from "express";
import { TuitionI as Tuition, TuitionI as TuitionInterface } from "../models/TuitionI";
import { Car } from "../models/CarI";

export class TuitionController {
  public async getAllTuitions(req: Request, res: Response) {
    try {
      const tuitions: TuitionInterface[] = await Tuition.findAll({
        where: { status: "ACTIVE" },
        include: [
          {
            model: Car,
            where: { status: "ACTIVE" },
            required: false,
          },
        ],
      });
      res.status(200).json({ tuitions });
    } catch (error) {
      res.status(500).json({ error: "Error fetching tuitions" });
    }
  }

  public async getTuitionById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const tuition = await Tuition.findOne({
        where: { id: pk, status: "ACTIVE" },
        include: [
          {
            model: Car,
            where: { status: "ACTIVE" },
            required: false,
          },
        ],
      });
      if (tuition) {
        res.status(200).json({ tuition });
      } else {
        res.status(404).json({ error: "Tuition not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching tuition" });
    }
  }

  public async createTuition(req: Request, res: Response) {
    const { date_matricula, ciudad, pago, car_id, status } = req.body;
    try {
      const carExists = await Car.findOne({ where: { id: car_id, status: "ACTIVE" } });
      if (!carExists) {
        res.status(404).json({ error: "Car not found or inactive" });
        return;
      }
      const body: TuitionInterface = { date_matricula, ciudad, pago, car_id, status };
      const newTuition = await Tuition.create({ ...body });
      res.status(201).json(newTuition);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async updateTuition(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { date_matricula, ciudad, pago, car_id, status } = req.body;
    try {
      const tuitionExist = await Tuition.findOne({ where: { id: pk, status: "ACTIVE" } });
      if (!tuitionExist) {
        res.status(404).json({ error: "Tuition not found or inactive" });
        return;
      }
      if (car_id) {
        const carExists = await Car.findOne({ where: { id: car_id, status: "ACTIVE" } });
        if (!carExists) {
          res.status(404).json({ error: "Car not found or inactive" });
          return;
        }
      }
      const body: TuitionInterface = { date_matricula, ciudad, pago, car_id, status };
      await tuitionExist.update(body, { where: { id: pk } });
      res.status(200).json(tuitionExist);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async deleteTuition(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const tuitionToDelete = await Tuition.findOne({ where: { id: pk } });
      if (tuitionToDelete) {
        await tuitionToDelete.destroy();
        res.status(200).json({ message: "Tuition deleted successfully" });
      } else {
        res.status(404).json({ error: "Tuition not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting tuition" });
    }
  }

  public async deleteTuitionAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const tuitionToUpdate = await Tuition.findOne({ where: { id: pk, status: "ACTIVE" } });
      if (tuitionToUpdate) {
        await tuitionToUpdate.update({ status: "INACTIVE" });
        res.status(200).json({ message: "Tuition marked as inactive" });
      } else {
        res.status(404).json({ error: "Tuition not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking tuition as inactive" });
    }
  }
}