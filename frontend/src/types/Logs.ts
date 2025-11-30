export type Logs = {
    uid: string
    authorized: boolean
    door_action: 'open' | 'deny' | 'lock'
    timestamp: string
    user_id: string
    source: string
}