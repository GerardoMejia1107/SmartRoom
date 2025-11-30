import {Sensor, ISensor} from "../models/sensors_model";

export class SensorService {
    static getAll(): Promise<ISensor[]> {
        return Sensor.find();
    }

    static getById(id: string): Promise<ISensor | null> {
        return Sensor.findById(id);
    }

    static create(data: Partial<ISensor>): Promise<ISensor> {
        const sensor = new Sensor(data);
        return sensor.save();
    }

    static update(id: string, data: Partial<ISensor>): Promise<ISensor | null> {
        return Sensor.findByIdAndUpdate(id, data, {new: true});
    }

    static delete(id: string): Promise<ISensor | null> {
        return Sensor.findByIdAndDelete(id);
    }
}