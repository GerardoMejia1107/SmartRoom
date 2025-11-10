import {Schema, model, Document} from "mongoose";

export interface IAlert extends Document {
    type: "unauthorized_presence" | "motion_alert" | "temp_high" | "humidity_high" | "forced_door";
    description: string;
    duration_ms?: number;
    timestamp: Date
    resolved: boolean;
    source: string;
}

const AlertSchema = new Schema<IAlert>(
    {
        type: {
            type: String,
            enum: ["unauthorized_presence", "motion_alert", "temp_high", "humidity_high", "forced_door"],
            required: true,
        },
        description: {type: String, required: true},
        duration_ms: {type: Number, default: 0},
        timestamp: {type: Date, default: Date.now},
        resolved: {type: Boolean, default: false},
        source: {type: String, default: "esp32-A"},
    },
    {timestamps: false}
);

export const Alert = model<IAlert>("Alert", AlertSchema);
