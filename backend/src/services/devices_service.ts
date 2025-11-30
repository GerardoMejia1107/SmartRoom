import {Device, IDevice} from "../models/device_model";


type WindowsState = 'open' | 'closed';
type DoorState = 'open' | 'closed' | 'locked';

export class DeviceService {


    static async getOrCreateControllerDevice(): Promise<IDevice> {
        let device = await Device.findOne()
        if (!device) {
            device = await Device.create({})
        }
        return device
    }

    static async getControllerDevice(): Promise<IDevice | null> {
        return Device.findOne()
    }

    static async updateManualcontrol(available: boolean): Promise<IDevice | null> {
        return Device.findOneAndUpdate(
            {},
            {
                $set: {
                    available,
                    updatedAt: new Date()
                }
            },
            {new: true, upsert: true}
        );
    }


    //PARA PUERTA
    static async updateDoor(params: { state: DoorState }): Promise<IDevice | null> {
        const updates: any = {
            "door.state": params.state,
            "door.last_changed": new Date(),
            updatedAt: new Date()
        }

        return Device.findOneAndUpdate(
            {}, {$set: updates}, {new: true, upsert: true}
        );
    }

    //PARA VENTANA
    static async updateWindow(params: { state: WindowsState }): Promise<IDevice | null> {
        const updates: any = {
            "window.state": params.state,
            "window.last_changed": new Date(),
            updatedAt: new Date()
        }
        return Device.findOneAndUpdate(
            {}, {$set: updates}, {new: true, upsert: true}
        )
    }

    //PARA LUCES
    static async updateLights(params: { on: boolean }): Promise<IDevice | null> {
        const updates: any = {
            "lights.on": params.on,
            "lights.last_changed": new Date(),
            updatedAt: new Date()
        }
        return Device.findOneAndUpdate(
            {}, {$set: updates}, {new: true, upsert: true}
        )
    }


}