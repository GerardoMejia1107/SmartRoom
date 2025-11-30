import {Request, Response} from "express";
import {DeviceService} from "../services/devices_service";
import {SensorService} from "../services/sensors_service";
import {Device} from "../models/device_model";
import mqtt_client from "../mqtt/mqtt_client";

export class DeviceController {
    static async getAll(req: Request, res: Response) {
        try {
            const devices = await DeviceService.getOrCreateControllerDevice()
            res.json(devices);
        } catch (e) {
            console.error("Error fetching devices:", e);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }

    static async updateManualControl(req: Request, res: Response) {
        try {
            const {available} = req.body;

            if (typeof available !== "boolean") {
                return res.status(400).json({error: "available must be boolean"});
            }

            const updated = await DeviceService.updateManualcontrol(available);

            mqtt_client.publish(
                "device/manual_control/available",
                available ? "true" : "false",
                {retain: true}
            );

            return res.json(updated);

        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Error updating manual control"});
        }
    }


    static async updateDoor(req: Request, res: Response) {
        try {
            const {state} = req.body;
            const updated = await DeviceService.updateDoor({
                state
            })

            mqtt_client.publish("device/door/state", state, {retain: true});
            return res.json(updated);

        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Error updating window state"});
        }
    }

    static async updateWindow(req: Request, res: Response) {
        try {
            const {state} = req.body
            const updated = await DeviceService.updateWindow({
                state
            })
            mqtt_client.publish("device/window/state", state, {retain: true});
            return res.json({updated})
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Error updating window state"});

        }
    }

    static async updateLights(req: Request, res: Response) {
        try {
            const {on} = req.body
            const updated = await DeviceService.updateLights({
                on
            })
            mqtt_client.publish("device/lights/state", on ? "on" : "off", {retain: true});
            return res.json({updated})
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: "Error updating lights state"});
        }
    }


}