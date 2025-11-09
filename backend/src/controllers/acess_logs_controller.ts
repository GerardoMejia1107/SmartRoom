import {Request, Response} from "express";
import {AccessLogsService} from "../services/access_logs_services";
import {AccessLog} from "../models/access_logs_model";

export class AcessLogsController {
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const logs = await AccessLogsService.getAll();
            res.json(logs)
        } catch (err) {
            console.error("Error getting access logs:", err);
            res.status(500).json({error: "Error fetching access logs"});
        }
    }

    static async getById(req: Request, res: Response): Promise<void> {
        try {
            const log = await AccessLogsService.getById(req.params.id)
            if (!log) {
                res.status(404).json({error: "Access log does not exist"});
                return
            }
            res.json(log)
        } catch (err) {
            console.error("Error getting access log:", err);
            res.status(500).json({error: "Error fetching access log"});
        }
    }

    static async create(req: Request, res: Response): Promise<void> {
        try {
            const newLog = await AccessLog.create(req.body)
            if (!newLog) {
                res.status(400).json({error: "Error creating access log"});
                return
            }
        } catch (e) {
            console.error("Error creating access log:", e);
            res.status(400).json({error: "Error creating access log"});
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const deletedLog = await AccessLogsService.delete(req.params.id)
            if (!deletedLog) {
                res.status(404).json({error: "Access log does not exist"});
                return
            }
            res.json({message: "Access log deleted", log: deletedLog})
        } catch (err) {
            console.error("Error deleting access log:", err);
            res.status(500).json({error: "Error deleting access log"});
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        try {
            const updatedLog = await AccessLogsService.update(req.params.id, req.body)
            if (!updatedLog) {
                res.status(404).json({error: "Access log does not exist"});
                return
            }
            res.json(updatedLog)
        } catch (err) {
            console.error("Error updating access log:", err);
            res.status(500).json({error: "Error updating access log"});
        }
    }
}