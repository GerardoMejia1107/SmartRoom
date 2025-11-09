import {Schema, Document, model} from "mongoose";

export interface IDevice extends Document {
    door: {
        state: 'open' | 'closed' | 'locked'
        last_changed: Date
    };
    window: {
        state: 'open' | 'closed'
        last_changed: Date
        angle_deg: number
    };
    lights: {
        on: boolean
        last_changed: Date
    };
    alarm: {
        active: boolean
        last_changed: Date
    };
    updatedAt: Date
}

const DeviceSchema = new Schema<IDevice>(
    {
        door: {
            state: {type: String, enum: ["open", "closed", "locked"], default: "closed"},
            lastChange: {type: Date, default: Date.now},
        },
        window: {
            state: {type: String, enum: ["open", "closed"], default: "closed"},
            angle_deg: {type: Number, default: 0},
            lastChange: {type: Date, default: Date.now},
        },
        lights: {
            on: {type: Boolean, default: false},
            lastChange: {type: Date, default: Date.now},
        },
        alarm: {
            active: {type: Boolean, default: false},
            lastChange: {type: Date, default: Date.now},
        },
        updatedAt: {type: Date, default: Date.now},
    },
    {timestamps: false}
);

export const Device = model<IDevice>('Device', DeviceSchema)