export type Alerts = {
    type: "unauthorized_presence" | "motion_alert" | "temp_high" | "humidity_high" | "forced_door",
    description: string,
    duration_ms: number,
    timestamp: string
    resolved: boolean,
    source: string,
}