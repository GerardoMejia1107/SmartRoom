import {Alert, IAlert} from "../models/alerts_model";

export class AlertService {
    static getAll(): Promise<IAlert[]> {
        return Alert.find();
    }

    static getById(id: string): Promise<IAlert | null> {
        return Alert.findById(id);
    }

    static create(data: Partial<IAlert>): Promise<IAlert> {
        const alert = new Alert(data);
        return alert.save();
    }

    static update(id: string, data: Partial<IAlert>): Promise<IAlert | null> {
        return Alert.findByIdAndUpdate(id, data, {new: true});
    }

    static delete(id: string): Promise<IAlert | null> {
        return Alert.findByIdAndDelete(id);
    }
}