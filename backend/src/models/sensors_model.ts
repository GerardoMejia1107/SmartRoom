import {Schema, Document, model} from "mongoose";

export interface ISensor extends Document {
    temperature_c: number
    humidity_pct: number
    light_adc: number
    low_light: boolean
    motion: boolean
    distance_cm: number
    near: boolean
    presence_counter_ms: number
    timestamp: Date
    source: string
}

const SensorSchema = new Schema<ISensor>(
    {
        temperature_c: {type: Number, required: true},
        humidity_pct: {type: Number, required: true},
        light_adc: {type: Number, required: true},
        low_light: {type: Boolean, required: true},
        motion: {type: Boolean, required: true},
        distance_cm: {type: Number, required: true},
        near: {type: Boolean, required: true},
        presence_counter_ms: {type: Number, required: true},
        timestamp: {type: Date, default: Date.now},
        source: {type: String, default: ''},
    },
    {timestamps: false},
)

export const Sensor = model<ISensor>('Sensor', SensorSchema);