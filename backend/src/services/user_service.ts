import {User, IUser} from "../models/user_model";

export class UserService {
    static getAll(): Promise<IUser[]> {
        return User.find();
    }

    static getById(id: string): Promise<IUser | null> {
        return User.findById(id)
    }

    static async getAllActiveUIDs(): Promise<String[]>{
        return  await User.find({active: true}).select("rfid_uid -_id").then(users => users.map(u => u.rfid_uid));
    }

    static create(data: Partial<IUser>): Promise<IUser> | null {
        const user = new User(data)
        return user.save();
    }

    static update(id: string, data: Partial<IUser>): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, data, {new: true});
    }

    static delete(id: string): Promise<IUser | null> {
        return User.findByIdAndDelete(id);
    }
}