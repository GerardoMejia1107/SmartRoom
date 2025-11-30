import {useFetch} from "../hooks/useFetch.ts";

export function useGetControls() {
    return useFetch(
        "http://localhost:3000/api/devices",
        "GET"
    )
}

export function useUpdateManualControl() {
    return useFetch(
        "http://localhost:3000/api/devices/available",
        "PATCH"
    )
}

export function useUpdateDoor() {
    return useFetch(
        "http://localhost:3000/api/devices/door",
        "PATCH"
    )
}

export function useUpdateWindow() {
    return useFetch(
        "http://localhost:3000/api/devices/window",
        "PATCH"
    )
}

export function useUpdateLights() {
    return useFetch(
        "http://localhost:3000/api/devices/lights",
        "PATCH"
    )
}

