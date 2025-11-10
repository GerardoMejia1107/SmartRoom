import {SensorService} from "../services/sensors_service";
import {Request, Response} from "express";


export class SensorController {
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const sensors = await SensorService.getAll()
            res.json(sensors)
        } catch (e) {
            console.error("Error getting sensors:", e);
            res.status(500).json({error: "Error getting sensors"})
        }
    }

    static async getById(req: Request, res: Response): Promise<void> {
        try {
            const sensor = await SensorService.getById(req.params.id)
            if (!sensor) {
                res.status(404).json({error: "No such sensor"})
                return
            }
            res.json(sensor)
        } catch (e) {
            console.error("Error getting sensor:", e);
            res.status(500).json({error: "Error getting sensor"})
        }
    }

    static async create(req: Request, res: Response): Promise<void> {
        try {
            const newSensor = await SensorService.create(req.body)
            if (!newSensor) {
                res.status(400).json({error: "Error creating sensor"})
                return
            }
            res.status(201).json(newSensor)
        } catch (e) {
            console.error("Error creating sensor:", e);
            res.status(400).json({error: "Error creating sensor"})
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        try {
            const updatedSensor = await SensorService.update(req.params.id, req.body)
            if (!updatedSensor) {
                res.status(404).json({error: "No such sensor"})
                return
            }
            res.json(updatedSensor)
        } catch (e) {
            console.error("Error updating sensor:", e);
            res.status(400).json({error: "Error updating sensor"})
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const deletedSensor = await SensorService.delete(req.params.id)
            if (!deletedSensor) {
                res.status(404).json({error: "No such sensor"})
                return
            }
            res.json({message: "Sensor deleted", sensor: deletedSensor})
        } catch (e) {
            console.error("Error deleting sensor:", e);
            res.status(500).json({error: "Error deleting sensor"})
        }
    }
}