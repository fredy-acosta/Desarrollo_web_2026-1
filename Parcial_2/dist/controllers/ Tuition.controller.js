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
exports.TuitionController = void 0;
const Tuitioni_1 = require("../models/Tuitioni");
const Cari_1 = require("../models/Cari");
class TuitionController {
    getAllTuitions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tuitions = yield Tuitioni_1.TuitionI.findAll({
                    where: { status: "ACTIVE" },
                    include: [
                        {
                            model: Cari_1.Car,
                            where: { status: "ACTIVE" },
                            required: false,
                        },
                    ],
                });
                res.status(200).json({ tuitions });
            }
            catch (error) {
                res.status(500).json({ error: "Error fetching tuitions" });
            }
        });
    }
    getTuitionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: pk } = req.params;
                const tuition = yield Tuitioni_1.TuitionI.findOne({
                    where: { id: pk, status: "ACTIVE" },
                    include: [
                        {
                            model: Cari_1.Car,
                            where: { status: "ACTIVE" },
                            required: false,
                        },
                    ],
                });
                if (tuition) {
                    res.status(200).json({ tuition });
                }
                else {
                    res.status(404).json({ error: "Tuition not found or inactive" });
                }
            }
            catch (error) {
                res.status(500).json({ error: "Error fetching tuition" });
            }
        });
    }
    createTuition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { date_matricula, ciudad, pago, car_id, status } = req.body;
            try {
                const carExists = yield Cari_1.Car.findOne({ where: { id: car_id, status: "ACTIVE" } });
                if (!carExists) {
                    res.status(404).json({ error: "Car not found or inactive" });
                    return;
                }
                const body = { date_matricula, ciudad, pago, car_id, status };
                const newTuition = yield Tuitioni_1.TuitionI.create(Object.assign({}, body));
                res.status(201).json(newTuition);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    updateTuition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: pk } = req.params;
            const { date_matricula, ciudad, pago, car_id, status } = req.body;
            try {
                const tuitionExist = yield Tuitioni_1.TuitionI.findOne({ where: { id: pk, status: "ACTIVE" } });
                if (!tuitionExist) {
                    res.status(404).json({ error: "Tuition not found or inactive" });
                    return;
                }
                if (car_id) {
                    const carExists = yield Cari_1.Car.findOne({ where: { id: car_id, status: "ACTIVE" } });
                    if (!carExists) {
                        res.status(404).json({ error: "Car not found or inactive" });
                        return;
                    }
                }
                const body = { date_matricula, ciudad, pago, car_id, status };
                yield tuitionExist.update(body, { where: { id: pk } });
                res.status(200).json(tuitionExist);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    deleteTuition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: pk } = req.params;
                const tuitionToDelete = yield Tuitioni_1.TuitionI.findOne({ where: { id: pk } });
                if (tuitionToDelete) {
                    yield tuitionToDelete.destroy();
                    res.status(200).json({ message: "Tuition deleted successfully" });
                }
                else {
                    res.status(404).json({ error: "Tuition not found" });
                }
            }
            catch (error) {
                res.status(500).json({ error: "Error deleting tuition" });
            }
        });
    }
    deleteTuitionAdv(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: pk } = req.params;
                const tuitionToUpdate = yield Tuitioni_1.TuitionI.findOne({ where: { id: pk, status: "ACTIVE" } });
                if (tuitionToUpdate) {
                    yield tuitionToUpdate.update({ status: "INACTIVE" });
                    res.status(200).json({ message: "Tuition marked as inactive" });
                }
                else {
                    res.status(404).json({ error: "Tuition not found or inactive" });
                }
            }
            catch (error) {
                res.status(500).json({ error: "Error marking tuition as inactive" });
            }
        });
    }
}
exports.TuitionController = TuitionController;
