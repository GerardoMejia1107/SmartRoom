import {Schema, model, Document} from "mongoose";

export interface IAccessLog extends Document {
    uid: string
    authorized: boolean
    door_action: 'open' | 'deny' | 'lock'
    timestamp: Date
    user_id?: Schema.Types.ObjectId
    source: string
}

const AccessLogSchema = new Schema<IAccessLog>({
    uid: {type: String, required: true},
    authorized: {type: Boolean, required: true},
    door_action: {type: String, enum: ['open', 'deny', 'lock'], default: 'deny', required: true},
    timestamp: {type: Date, default: Date.now},
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    source: {type: String, default: ''},

}, {timestamps: false},)


export const AccessLog = model<IAccessLog>('AccessLog', AccessLogSchema);