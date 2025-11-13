import {AccessLog, IAccessLog} from "../models/access_logs_model";

export class AccessLogsService {
    static getAll(): Promise<IAccessLog[]> {
        return AccessLog.find();
    }

    static getById(id: string): Promise<IAccessLog | null> {
        return AccessLog.findById(id)
    }

    static create(data: Partial<IAccessLog>): Promise<IAccessLog> {
        data.door_action = data.authorized ? 'open' : 'deny';
        const accessLog = new AccessLog(data);
        return accessLog.save();
    }

    static update(id: string, data: Partial<IAccessLog>): Promise<IAccessLog | null> {
        return AccessLog.findByIdAndUpdate(id, data, {new: true});
    }

    static delete(id: string): Promise<IAccessLog | null> {
        return AccessLog.findByIdAndDelete(id);
    }
}