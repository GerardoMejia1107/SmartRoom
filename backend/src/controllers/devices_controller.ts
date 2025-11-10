import {Request, Response} from "express";
import {DeviceService} from "../services/devices_service";
import {SensorService} from "../services/sensors_service";
import {Device} from "../models/device_model";

export class DeviceController {
    static async getAll(req: Request, res: Response) {
        try {
            const devices = await DeviceService.getAll()
            res.json(devices);
        } catch (e) {
            console.error("Error fetching devices:", e);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }

    static async getById(req: Request, res: Response): Promise<void> {
        try {
            const device = await DeviceService.getById(req.params.id)
            if (!device) {
                res.status(404).json({error: "No such device"})
                return
            }
            res.json(device)
        } catch (e) {
            console.error("Error getting sensor:", e);
            res.status(500).json({error: "Error getting sensor"})
        }
    }

    static async create(req: Request, res: Response): Promise<void> {
        try {
            const newDevice = await DeviceService.create(req.body)
            if (!newDevice) {
                res.status(400).json({error: "Error creating device"})
                return
            }
            res.status(201).json(newDevice)
        } catch (e) {
            console.error("Error creating device:", e);
            res.status(400).json({error: "Error creating device"})
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        try {
            const updatedDevice = await DeviceService.update(req.params.id, req.body)
            if (!updatedDevice) {
                res.status(404).json({error: "No such device"})
                return
            }
            res.json(updatedDevice)
        } catch (e) {
            console.error("Error updating device:", e);
            res.status(400).json({error: "Error updating device"})
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const deletedDevice = await DeviceService.delete(req.params.id)
            if (!deletedDevice) {
                res.status(404).json({error: "No such device"})
                return
            }
            res.json({message: "Device deleted", device: deletedDevice})
        } catch (e) {
            console.error("Error deleting device:", e);
            res.status(500).json({error: "Error deleting device"})
        }
    }


}