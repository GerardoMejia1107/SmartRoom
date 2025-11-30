import {useFetch} from "../hooks/useFetch.ts";
import type {Sensor} from "../types/Sensors.ts";

export function useGetSensors() {
    return useFetch<Sensor>(
        "http://localhost:3000/api/sensors",
        "GET"
    )
}