import {Schema, Document, model} from "mongoose";

export interface IDevice extends Document {
    available: boolean;

    door: {
        state: 'open' | 'closed' | 'locked'
        last_changed: Date
    };
    window: {
        state: 'open' | 'closed'
        last_changed: Date
    };
    lights: {
        on: boolean
        last_changed: Date
    };
    updatedAt: Date
}

const DeviceSchema = new Schema<IDevice>(
    {
        available: {type: Boolean, default: false},
        door: {
            state: {type: String, enum: ["open", "closed", "locked"], default: "closed"},
            last_changed: {type: Date, default: Date.now},
        },
        window: {
            state: {type: String, enum: ["open", "closed"], default: "closed"},
            last_changed: {type: Date, default: Date.now},
        },
        lights: {
            on: {type: Boolean, default: false},
            last_changed: {type: Date, default: Date.now},
        },

        updatedAt: {type: Date, default: Date.now},
    },
    {timestamps: false}
);

export const Device = model<IDevice>('Device', DeviceSchema)