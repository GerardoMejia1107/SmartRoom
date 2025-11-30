import {Request, Response} from "express";
import {AlertService} from "../services/alerts_services";

export class AlertController {
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const alerts = await AlertService.getAll()
            res.json(alerts)
        } catch (e) {
            console.error("Error getting alerts:", e);
            res.status(500).json({error: "Error getting alerts"})
        }
    }

    static async getById(req: Request, res: Response): Promise<void> {
        try {
            const alert = await AlertService.getById(req.params.id)
            if (!alert) {
                res.status(404).json({error: "No such alert"})
                return
            }
            res.json(alert)
        } catch (e) {
            console.error("Error getting alert:", e);
            res.status(500).json({error: "Error getting alert"})
        }
    }

    static async create(req: Request, res: Response): Promise<void> {
        try {
            const newAlert = await AlertService.create(req.body)
            if (!newAlert) {
                res.status(400).json({error: "Error creating alert"})
                return
            }
            res.status(201).json(newAlert)
        } catch (e) {
            console.error("Error creating alert:", e);
            res.status(400).json({error: "Error creating alert"})
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        try {
            const updatedAlert = await AlertService.update(req.params.id, req.body)
            if (!updatedAlert) {
                res.status(404).json({error: "No such alert"})
                return
            }
            res.json(updatedAlert)
        } catch (e) {
            console.error("Error updating alert:", e);
            res.status(400).json({error: "Error updating alert"})
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const deletedAlert = await AlertService.delete(req.params.id)
            if (!deletedAlert) {
                res.status(404).json({error: "No such alert"})
                return
            }
            res.json(deletedAlert)
        } catch (e) {
            console.error("Error deleting alert:", e);
            res.status(400).json({error: "Error deleting alert"})
        }
    }
}