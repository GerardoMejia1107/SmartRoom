import {Schema, model, Document} from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    rfid_uid: string;
    role: 'admin' | 'user' | 'guest';
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        rfid_uid: {type: String, required: true, unique: true},
        role: {type: String, enum: ['admin', 'user', 'guest'], default: 'user'},
        active: {type: Boolean, default: true},
    }, {timestamps: true},
)

export const User = model<IUser>('User', UserSchema);