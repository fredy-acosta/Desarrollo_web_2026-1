import { Request, Response } from "express";
import { Car, CarI } from "../models/Cari";
import { TuitionI } from "../models/Tuitioni";

export class CarController {
  public async getAllCars(req: Request, res: Response) {
    try {
      const cars: CarI[] = await Car.findAll({
        where: { status: "ACTIVE" },
        include: [
          {
            model: TuitionI,
            where: { status: "ACTIVE" },
            required: false,
          },
        ],
      });
      res.status(200).json({ cars });
    } catch (error) {
      res.status(500).json({ error: "Error fetching cars" });
    }
  }

  public async getCarById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const car = await Car.findOne({
        where: { id: pk, status: "ACTIVE" },
        include: [
          {
            model: TuitionI,
            where: { status: "ACTIVE" },
            required: false,
          },
        ],
      });
      if (car) {
        res.status(200).json({ car });
      } else {
        res.status(404).json({ error: "Car not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching car" });
    }
  }

  public async createCar(req: Request, res: Response) {
    const { marca, clase, modelo, cilindraje, capacidad, status } = req.body;
    try {
      const body: CarI = { marca, clase, modelo, cilindraje, capacidad, status };
      const newCar = await Car.create({ ...body });
      res.status(201).json(newCar);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async updateCar(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { marca, clase, modelo, cilindraje, capacidad, status } = req.body;
    try {
      const body: CarI = { marca, clase, modelo, cilindraje, capacidad, status };
      const carExist = await Car.findOne({ where: { id: pk, status: "ACTIVE" } });
      if (carExist) {
        await carExist.update(body, { where: { id: pk } });
        res.status(200).json(carExist);
      } else {
        res.status(404).json({ error: "Car not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async deleteCar(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const carToDelete = await Car.findOne({ where: { id: pk } });
      if (carToDelete) {
        await carToDelete.destroy();
        res.status(200).json({ message: "Car deleted successfully" });
      } else {
        res.status(404).json({ error: "Car not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting car" });
    }
  }

  public async deleteCarAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const carToUpdate = await Car.findOne({ where: { id: pk, status: "ACTIVE" } });
      if (carToUpdate) {
        await carToUpdate.update({ status: "INACTIVE" });
        res.status(200).json({ message: "Car marked as inactive" });
      } else {
        res.status(404).json({ error: "Car not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking car as inactive" });
    }
  }
}