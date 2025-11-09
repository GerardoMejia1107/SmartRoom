import {Device, IDevice} from "../models/device_model";

export class DeviceService {
    static getAll(): Promise<IDevice[]> {
        return Device.find();
    }

    static getById(id: string): Promise<IDevice | null> {
        return Device.findById(id)
    }

    static create(data: Partial<IDevice>): Promise<IDevice> {
        const device = new Device(data);
        return device.save();
    }

    static update(id: string, data: Partial<IDevice>): Promise<IDevice | null> {
        return Device.findByIdAndUpdate(id, data, {new: true});
    }

    static delete(id: string): Promise<IDevice | null> {
        return Device.findByIdAndDelete(id);
    }
}